var express = require('express');
var commoditDao = require('../dao/commoditDao');
var userDao = require('../dao/userDao');
var typeModelDao = require('../dao/typeModelDao')
// var multiparty = require('multiparty');
var async = require('async');
// var fs = require('fs');
var router = express.Router();

// router.use(function(req, res, next) {
//   // .. 全局登陆验证
//   console.log('-----   c    -----');
   
// });

router.get('/commodit/:id', function(req, res){
  if(req.params.id){
    var id = req.params.id;
    // console.log('req.params.id : '+id)
    commoditDao.findById(id,function(err, data){
      if(err){
        console.log(err);
        res.json({message : "获取失败！"})
      }else{
        res.json({item : data})
      }
    });
  }else{
    res.json({message : "获取失败！"})
  }
});
// router.get('/commoditsList', function(req, res){
//   console.log(req.params.id)
//   commoditDao.findAllList(function(err, data){
//     if(err){
//       console.log(err);
//       res.json({message : "获取失败！"})
//     }else{
//       res.json({items : data})
//     }
//   });
// });
router.get('/commoditsByPage', function(req, res){
  var page = {
    pageSize : req.query.pageSize,
    currentPage : req.query.currentPage
  }
  // console.log(page)
  commoditDao.commoditsByPage(page,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({items : data});
    }
  });
});
//注意和user中的区别   获取商品简略信息
router.get('/commoditsInfoByPage', function(req, res){
  var options = {
    pageSize : req.query.pageSize || 10,
    currentPage : req.query.currentPage || 0
  }
  //考虑增加返回字段信息
  var conditions = {
    state : {
      $eq : 2
    }
  }
  console.log(options)
  commoditDao.commoditsInfoByPage(conditions,null,options,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({items : data});
    }
  });
});
// 商品类型遍历//
router.get('/typeRootLists', function(req, res) {
  typeModelDao.findByParentId('',function(err , data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({items : data})
    }
  })  
});
router.get('/typeChildren/:id', function(req, res){
  typeModelDao.findByParentId(req.params.id,function(err,data){
    if(err){
      console.log(err);
      res.json({message:"获取失败！"})
    }else{
      res.json({items:data})
    }
  })
})
// 根据id获取分类
router.get('/type/:id',function(req, res){
  typeModelDao.findById(req.params.id,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({item : data});
    }
  })
});
//*注册相关**/
router.get('/isLogin', function(req, res) {
  //验证状态是不是已经登陆
  if(req.session && req.session.user){
    res.json({isLogin : true});
  }else{
    res.json({isLogin : false});
  }
});
router.get('/logout', function(req, res) {
  //退出登陆状态
  if(req.session.user){
    delete req.session.user;
  }
  res.json({"isLogin":false})
});
router.get('/regist', function(req, res) {
  //注册页面
  res.render('registPage');
});
router.post('/regist', function(req, res) {
  var user = {
    userName : req.body.userName||'',
    password : req.body.password||'',
    rePW : req.body.rePW
  }
  //用户注册
  async.waterfall([
    function(callback){
      if(user.password!=user.rePW){
        callback("两次密码输入不一致！")
      }else if(user.userName=="" || user.password==""){
        callback("用户名或密码不能为空！")
      }else if(user.userName==user.password){
        callback("用户名或密码不能相同！")
      }
      else{
        userDao.findByUserName(user.userName,function(err,data){
          if(err){
            console.log(err);
            callback("注册失败！")
          }else{
            if(data){
              callback("用户名已经被注册！")
            }else{
              callback(null)
            }
          }
        })
      }
    },
    function(callback){
      userDao.addUser(user,function(err,data){
        if(err){
          console.log(err);
          callback("注册失败！")
        }else{
          callback(null,data)
        }
      })
    }],function(err,data){
      if(err){
        res.render('registPage',{
          user : user,
          message : err
        });
      }else{
        req.session.user = data;
        res.redirect('/')
      }
  })  
});
router.post('/login', function(req, res) {
  console.log('login : ');
  //登陆验证
  var userName = req.body.userName;
  var password = req.body.password;
  if(userName!="" && password!=""){
    userDao.findByUserName(userName,function(err, data){
      if(err){
        res.json({isLogin : false})
      }else{
        console.log(data)
        if(data && data.password == password){
          req.session.user = data;
          res.json({isLogin : true})
        }else{
          res.json({isLogin : false})
        }
      }
    })
  }else{
    res.json({isLogin : false})
  }
});

module.exports = router;
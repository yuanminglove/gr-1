var express = require('express');
var typeModelDao = require('../dao/typeModelDao')
var async = require('async');
var router = express.Router();

/* Router中只负责接收数据和返回数据，只做跳转逻辑处理 */
router.use(function(req, res, next) {
  // .. 全局登陆验证
  // console.log('全局登陆验证');
  // if(req.session.name){
  //   console.log(req.session.name);
  //   next()
  // }else{
  //   res.redirect('/');
  // }
  next();
});
router.get('/', function(req, res) {
  res.render('./admin/index');
  
});
// 获取顶级分类
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
// 创建新分类
router.post('/typeAdd', function(req, res){
  var type = JSON.parse(req.body.data);//转换数据为json格式
  //调用typeModelDao保存数据，先做数据的非法性检测
  typeModelDao.add(type,function(err,data){
    if(err){
      console.log(err);
      res.json({message : '保存失败！'});
    }else{
      typeModelDao.findAll(function(err,data){
        console.log(data)
      })
      res.json({message : '保存成功！'});
    }
  })  
})
router.post('/typeUpdate', function(req, res){
  var type = JSON.parse(req.body.data);//转换数据为json格式
  //调用typeModelDao保存数据，先做数据的非法性检测
  typeModelDao.update(type,function(err,data){
    if(err){
      console.log(err);
      res.json({message : '保存失败！'});
    }else{
      typeModelDao.findAll(function(err,data){
        console.log(data)
      })
      res.json({message : '保存成功！'});
    }
  })  
})
// 根据ID删除分类
router.get('/typeDel/:id', function(req, res){
  typeModelDao.deleteById(req.params.id,function(err){
    if(err){
      console.log(err);
      res.json({message : "删除失败！"})
    }else{
      res.json({message : "删除成功！"})
    }
  })
})
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

module.exports = router;

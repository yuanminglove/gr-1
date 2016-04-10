var express = require('express');
var commoditDao = require('../dao/commoditDao');
var collectionDao = require('../dao/collectionDao');
var userDao = require('../dao/userDao');
var addressDao = require('../dao/addressDao');
var orderDao = require('../dao/orderDao');
var multiparty = require('multiparty');
var async = require('async');
var fs = require('fs');
var router = express.Router();

/* Router中只负责接收数据和返回数据，只做跳转逻辑处理 */
router.use(function(req, res, next) {
  // .. 全局登陆验证
  // console.log('全局登陆验证');
  if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }  
});
router.get('/', function(req, res) {
  res.render('./user/index');
});
router.post('/commoditAdd', function(req, res){
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/upload/'});
  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var thumbnail = [];
    for(var i in files){
        var path = files[i][0].path;
        path = path.replace(/\\/g,'/');
        path = path.replace(/public\//,'/');

        thumbnail.push(path);
      
    }
    var commodit;
    // console.log(fields);
    try{      
      commodit = {
        name : fields.name[0],
        price : fields.price[0],
        describe : fields.describe[0],
        'thumbnail' : thumbnail,
        sum : fields.sum[0],
        typeId : fields.typeId[0],
        keyValue : JSON.parse(fields.KV[0]),
        belong : req.session.user._id,//商品所有者ID
        'state' : 0
      }
      // console.log(commodit);
      console.log(commodit)
      commoditDao.add(commodit,function(err,data){
        if(err){
          console.log(err);
          res.json({message : "1保存失败!"});
        }else{
          console.log(data);
          res.json({message : "ok",commoditId : data._id});
        }
      })
    }catch(err){
      console.log("commodit update err : "+err);
      res.json({message : "2保存失败!"});
    }
    console.log('Upload completed!');
    // res.setHeader('text/plain');
    
  });
});
router.get('/commoditDel/:id',function(req,res){
  async.waterfall([
    function(callback){
      commoditDao.findById(req.params.id,function(err, data){
        if(err){
          console.log(err);
          callback(err);
        }else{
          callback(null,data);          
        }
      });
    },
    function(data, callback){
      if(data && data.belong == req.session.user._id){
        commoditDao.deleteById(data._id,function(err){
          if (err) {
            callback(err);
          } else{
            callback(null);            
          };
        });
      }else{
        callback("数据不存在！")
      }
    }],function(err,result){
      if(err){
        console.log(err);
        res.json({message : "删除失败！"});
      }else{
        res.json({message : "删除成功！"});
      }
  })
});
router.post('/commoditUpdate',function(req, res){
  async.waterfall([  
      function(callback){  
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        //上传完成后处理
        form.parse(req,function(err, fields, files){ 
          callback(err,fields,files);
        });
      },  
      function(fields, files, callback){  
        //查找商品是否存在
        // console.log('fields.id : '+fields.id)
        commoditDao.findById(fields.id[0],function(err, data){
          if(data && data._id==fields.id[0]){
            // console.log(data)
            delete data._id;
            data.id=fields.id[0];
            callback(null,fields,files,data)
          }else{
            callback("数据不存在！")
          }
        })
      },
      function(fields ,files ,commodit ,callback){        
        //做数据跟新
        commodit.name  = fields.name[0];
        commodit.price  = fields.price[0];
        commodit.sum  = fields.sum[0];
        commodit.describe  = fields.describe[0];
        commodit.keyValue = JSON.parse(fields.KV[0]);

        for(var i=1; i<=4; i++){
          var item = "p"+i;
          if(files[item]){
            var path = files['p'+i][0].path;
            path = path.replace(/\\/g,'/');
            path = path.replace(/public\//,'/');
            console.log("path : "+path)
            commodit.thumbnail[i-1]=path;
          }
        }

        commoditDao.update(commodit,function(err,data){
          callback(err,commodit.id)
        })
      }
  ], function (err, data) {  
      if(err){
        console.log("commodit update err : "+err);
        res.json({message : "更新失败！"})
      }else{
        console.log(data)
        res.json({message : "ok",commoditId : data})
      }
  }); 
 
});
router.get('/commoditPublish/:id',function(req, res){
  //修改商品状态
  if(req.params.id){
    var conditions = {
      '_id' : req.params.id,
      'belong' : req.session.user._id
    }
    var update = {
      $set : {
        'state' : 2
      }
    }
    commoditDao.publish(conditions,update,null,function(err,data){
      if(err){
        console.log(err);
        res.json({message : "发布商品失败！"});
      }else{
        console.log(data)
        res.json({message : "发布商品成功！"})
      }
    })
  }else{
    res.json({message : "发布商品失败！"})
  }
})
router.get('/commoditUnPublish/:id',function(req, res){
  //修改商品状态
  if(req.params.id){
    var conditions = {
      '_id' : req.params.id,
      'belong' : req.session.user._id
    }
    var update = {
      $set : {
        'state' : 1
      }
    }
    commoditDao.publish(conditions,update,null,function(err,data){
      if(err){
        console.log(err);
        res.json({message : "下架商品失败！"});
      }else{
        console.log(data)
        res.json({message : "下架商品成功！"})
      }
    })
  }else{
    res.json({message : "下架商品失败！"})
  }
})
router.get('/commodit/:id', function(req, res){
  if(req.params.id){
    var id = req.params.id;
    // console.log('req.params.id : '+id)
    commoditDao.findById(id,function(err, data){
      if(err){
        console(err);
        res.json({message : "获取失败！"})
      }else{
        res.json({item : data})
      }
    });
  }else{
    res.json({message : "获取失败！"})
  }
});
router.get('/commoditsList', function(req, res){
  // console.log(req.params.id)
  var option = {
    belong : req.session.user._id
  }
  commoditDao.findAllList(option,function(err, data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({items : data})
    }
  });
});
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
router.get('/commoditsInfoByPage', function(req, res){
  var options = {
    pageSize : req.query.pageSize || 10,
    currentPage : req.query.currentPage || 0
  }
  var conditions = {
    belong : req.session.user._id
  }
  // console.log(page)
  commoditDao.commoditsInfoByPage(conditions,null,options,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "获取失败！"})
    }else{
      res.json({items : data});
    }
  });
});
router.get('/collect/:id',function(req,res){
  async.waterfall([
    function(callback){
      if(req.params.id){
        commoditDao.findById(req.params.id,function(err,data){
          if(data)
            callback(err,data);
          else
            callback("商品不存在！")
        });
      }else{
        callback("商品不存在！")
      }
    },
    function(data , callback){
      //验证商品是不是自己发布的
      if(data.belong == req.session.user._id){
        callback("不能收藏自己的商品！")
      }else{
        callback(null,data)        
      }
    },function(data,callback){
      var conditions = {
        userId : req.session.user._id,
        commoditId : data._id
      }
      collectionDao.findByOptions(conditions,function(err,data){
        if(data.length){
          console.log(data);
          callback("不能重复收藏商品！")
        }else{
          callback(null,conditions)
        }
      })      
    },function(collection,callback){
      collectionDao.add(collection,function(err,data){
        console.log(data);
        callback(err);
      })
    }],function(err,data){
    if(err){
      console.log(err);
      res.json({message : "商品收藏失败！"});
    }else{
      res.json({message : "商品收藏成功！"});
    }
  })
});
router.get('/collectionsList',function(req,res){
  async.waterfall([
    function(callback){
      collectionDao.findByUser(req.session.user._id,function(err,data){
        if(err){
          console.log(err);
          callback(err);
        }else{
          callback(null,data);
        }
      })
    },
    function(data , callback){
      var commotidsId = [];
      for(var i in data){
        commotidsId.push(data[i].commoditId)
      }
      commoditDao.commoditsInfoByIDs(commotidsId,function(err,data){
        if(err){
          console.log(err);
          callback(err);
        }else{
          callback(null,data)
        }
      })
    }],function(err,data){
    if(err){
      console.log(err);
      res.json({message : "商品收藏查询失败！"});
    }else{
      res.json({items : data});
    }
  })
});
router.get('/collectionDel/:id',function(req, res){
  async.waterfall([
    function(callback){
      if(req.params.id){
        collectionDao.deleteByCommoditId(req.params.id,function(err,data){
          callback(err,data)
        })
      }
    }],function(err ,data){
      if(err){
        console.log(err);
        res.json({message : "删除失败！"})
      }else{
        res.json({message : "删除成功！",falg : true})
      }
  })
});
router.get('/selfInfo',function(req,res){
  userDao.findById(req.session.user._id,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "个人信息获取失败！"})
    }else{
      data.password = null;
      res.json({user : data});
    }
  })  
});
router.get('/address',function(req,res){
  addressDao.findByUserId(req.session.user._id,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "收货地址获取失败！"})
    }else{
      res.json({address : data});
    }
  });
});
router.post('/addAddress',function(req,res){
  var address = JSON.parse(req.body.address);
  address.belong = req.session.user._id;
  addressDao.addAddress(address,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "新增收货地址失败！"})
    }else{
      // console.log(data);
      res.json({address : data})
    }
  });
  
});
router.get('/delAddress/:id',function(req,res){
  if(req.params.id){
    var conditions = {
      '_id' : req.params.id,
      'belong' : req.session.user._id
    }
    addressDao.delAddress(conditions,function(err,data){
      if(err){
        console.log(err);
        res.json({message : "删除收货地址失败！"})
      }else{
        // console.log(data);
        res.json({address : null})
      }
    });    
  }else{
    res.json({message : "删除收货地址失败！"})
  }
  
});
router.get('/setDefaultAddress/:id',function(req,res){
  var conditions = {
      '_id' : req.params.id,
      'belong' : req.session.user._id
  }
  addressDao.setDefaultAddress(conditions,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "设置默认收货地址失败！"})
    }else{
      // console.log(data);
      res.json({address : data})
    }
  })
  
});
router.get('/createSingleOrder',function(req,res){
  //购买单个商品，生产商品订单（数量默认为1个，可以在订单中修改）
  var commoditId = req.query.id;
  // orderDao
  async.waterfall([
    function(cb){
      //查询商品是否存在，并验证商品状态是否为在售，存货数量是否足够
      
      commoditDao.findById(commoditId,function(err,data){
        if(err){
          console.log(err);
          cb("商品查询失败！");
        }else if(data.state !== 2){
          cb("商品不在销售状态！");
        }else if(data.sum < 1){
          cb("商品存货不足了！");
        }else{
          cb(null,data);
        }
      })
    },
    function(commodit,cb){
      //添加收货地址，查看是否有默认收货地址
      var conditions = {
        'belong' : req.session.user._id,
        "isDefault" : true
      }
      addressDao.findByConditions(conditions,function(err,data){
        if(err){
          console.log(err);
          cb("收货地址查询失败");
        }else{
          if(data.length == 0){
            //不存在默认收货地址的情况
            cb(null,commodit,null);
          }else{
            //存在默认收货地址
            cb(null,commodit,data);
          }
        }
      })
    },
    function(commodit,address,cb){
      if(!address){
        //不存在默认收货地址的情况,返回当前用户地址中的一个
        addressDao.findByUserId(req.session.user._id,function(err,data){
          if(err){
            console.log(err);
            cb("收货地址查询失败");
          }else{
            //因为查询到的收货地址是一个数组，所以返回data[0]
            cb(null,commodit,data[0]);
          }
        })
      }else{
        //因为查询到的默认收货地址是一个数组，所以返回address[0]
        if(commodit._id){
          cb(null,commodit,address[0]);
        }else{
          cb("当前商品不存在！")
        }
      }
    },
    function(commodit,address,cb){
      //创建订单，保存订单信息<如果没有默认收货地址，则先创建一个不带收货地址的订单，不返回address,在页面中做判断，是否设置有默认收货地址>
      var order = {
        belong: req.session.user._id,
        receiverName : address.receiverName || null,
        receiverPhone : address.receiverPhone || null,
        receiverAddress : address.receiverAddress || null,
        commoditsList : [{
          id : commodit._id,
          name : commodit.name,
          price : commodit.price,
          pic : commodit.thumbnail[0],
          amount : 1
        }],
        total : commodit.price,
        date : new Date()
      }
      orderDao.addOrder(order,function(err,data){
        if(err){
          console.log(err);
          callback("新增订单失败！")
        }else{
          console.log(data);
          cb(null,data._id)
        }        
      })
    }],function(err,data){
      //返回订单ID
      if (err) {
         res.json({message : err})
      } else{
        res.json({orderId : data})
      }
    })
  

});
router.post('/createManyOrder',function(req,res){
  //购买多个商品，生产商品订单（购买数量默认为1个，可以在订单中修改）
  var commoditIds = req.body.ids;
  // orderDao
  async.waterfall([
    function(cb){
      //查询商品是否存在，并验证商品状态是否为在售，存货数量是否足够
      var conditions = {
        '_id' : {
          $in : JSON.parse(commoditIds)
        },
        'state' : 2
      }
      // console.log(conditions);
      commoditDao.findByConditions(conditions,function(err,data){
        if(err){
          console.log(err);
          cb("商品查询失败！");
        }else{
          cb(null,data)
        }
      })
    },
    function(commodits,cb){
      //添加收货地址，查看是否有默认收货地址
      var conditions = {
        'belong' : req.session.user._id,
        "isDefault" : true
      }
      if(commodits.length<1){
        cb("未添加任何商品")
      }else{
        addressDao.findByConditions(conditions,function(err,data){
          if(err){
            console.log(err);
            cb("收货地址查询失败");
          }else{
            if(data.length == 0){
              //不存在默认收货地址的情况
              cb(null,commodits,null);
            }else{
              //存在默认收货地址
              cb(null,commodits,data);
            }
          }
        })
      }     
    },
    function(commodits,address,cb){
      if(!address){
        //不存在默认收货地址的情况,返回当前用户地址中的一个
        addressDao.findByUserId(req.session.user._id,function(err,data){
          if(err){
            console.log(err);
            cb("收货地址查询失败");
          }else{
            //因为查询到的收货地址是一个数组，所以返回data[0]
            cb(null,commodits,data[0]);
          }
        })
      }else{
        //因为查询到的默认收货地址是一个数组，所以返回address[0]
        cb(null,commodits,address[0]);
      }
    },
    function(commodits,address,cb){
      //创建订单，保存订单信息
      var commoditsList = [];
      var total = 0;
      for(var i in commodits){
        var j = {
          id : commodits[i]._id,
          name : commodits[i].name,
          price : commodits[i].price,
          pic : commodits[i].thumbnail[0],
          amount : 1
        }
        total = total + commodits[i].price;
        commoditsList.push(j);
      };
      var order = {
        belong: req.session.user._id,
        receiverName : address.receiverName || null,
        receiverPhone : address.receiverPhone || null,
        receiverAddress : address.receiverAddress || null,
        'commoditsList' : commoditsList,
        'total' : total,
        date : new Date()
      };
      orderDao.addOrder(order,function(err,data){
        if(err){
          console.log(err);
          callback("新增订单失败！")
        }else{
          // console.log(data);
          cb(null,data._id)
        }        
      })
    }],function(err,data){
      if (err) {
         res.json({message : err})
      } else{
        res.json({orderId : data})
      }
    })

});
router.get('/orderList',function(req,res){
    //查看订单
  orderDao.findBelong(req.session.user._id,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "订单查询失败！"})
    }else{
      //颠倒订单的顺序
      data.reverse();
      res.json({items : data});
    }
  })
});
router.get('/order/:id',function(req,res){
  //payOne公用同一个路由，在payOne中用户不能通过页面事件修改订单信息，在order/:id中提供修改事件
  //根据订单id查看订单
  //已经锁定的订单直接进入
  var orderId = req.params.id;
  orderDao.findById(orderId,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "订单查询失败！"})
    }else{
      res.json({item : data});
    }
  })
});
router.get('/orderMinusAmount',function(req,res){
  //减少订单中某个商品的购买数量
  var commoditId = req.query.commoditId;
  var orderId = req.query.orderId;
  async.waterfall([
    function(cb){
      var conditions = {
        '_id':orderId || null,
        'belong':req.session.user._id
      }
      orderDao.findByConditions(conditions,function(err,data){
        if(err || data.length<1){
          console.log(err || '订单不存在!');
          cb("订单查询失败！")
        }else{
          cb(null,data[0])
        }
      })
    },function(order,cb){
      //检测商品状态是否锁定
      if(order.state == 1){
        cb("锁定状态，不允许修改！")
      }else{
        cb(null,order)
      }
    },function(order,cb){
      var total = 0;
      for(var i in order.commoditsList){
        if(order.commoditsList[i].id == commoditId && order.commoditsList[i].amount > 0){
          order.commoditsList[i].amount = order.commoditsList[i].amount-1;   
        }
        total = total + order.commoditsList[i].amount*order.commoditsList[i].price;
        // console.log(total)
      }
      order.total = total;
      orderDao.update(order._id,order,function(err,data){
        if(err){
          console.log(err);
          cb("减少商品数量失败！")
        }else{
          cb(null,data);
        }
      })
    }],
    function(err,data){
      console.log(data);
      if(err){
        console.log(err)
        res.json({message : err})
      }else{
        res.json({message : "ok"})
      }
  })
});
router.get('/orderPlusAmount',function(req,res){
  //增加订单中某个商品的购买数量
  var commoditId = req.query.commoditId;
  var orderId = req.query.orderId;
  async.waterfall([
    function(cb){
      var conditions = {
        '_id':orderId || null,
        'belong':req.session.user._id
      }
      orderDao.findByConditions(conditions,function(err,data){
        if(err || data.length<1){
          console.log(err || '订单不存在!');
          cb("订单查询失败！")
        }else{
          cb(null,data[0])
        }
      })
    },function(order,cb){
      //检测商品状态是否锁定
      if(order.state == 1){
        cb("锁定状态，不允许修改！")
      }else{
        cb(null,order)
      }
    },function(order,cb){
      //验证商品实际存储量是否足够
      commoditDao.findById(commoditId,function(err,data){
        if(err || !data.sum){
          console.log(err || '商品不存在!');
          cb('商品不存在!')
        }else{
          cb(null,order,data.sum)
        }
      })
    },function(order,commoditSum,cb){
      var total = 0;
      for(var i in order.commoditsList){
        if(order.commoditsList[i].id == commoditId && order.commoditsList[i].amount < commoditSum){
          order.commoditsList[i].amount = order.commoditsList[i].amount+1;   
        }
        total = total + order.commoditsList[i].amount*order.commoditsList[i].price;
        // console.log(total)
      }
      order.total = total;
      orderDao.update(order._id,order,function(err,data){
        if(err){
          console.log(err);
          cb("减少商品数量失败！")
        }else{
          cb(null,commoditSum,data);
        }
      })
    }],
    function(err,commoditSum,data){
      console.log(data);
      if(err){
        console.log(err)
        res.json({message : err})
      }else{
        res.json({message : "ok",'commoditSum' : commoditSum})
      }
  })
});
router.get('/orderChangeAmount',function(req,res){
  //增加订单中某个商品的购买数量
  var commoditId = req.query.commoditId;
  var orderId = req.query.orderId;
  var amount = req.query.amount;
  var reg = new RegExp("\D");
  if(amount && reg.test(amount)){
    amount = Math.abs(amount);
  }
  async.waterfall([
    function(cb){
      //查询当前订单
      var conditions = {
        '_id':orderId || null,
        'belong':req.session.user._id
      }
      orderDao.findByConditions(conditions,function(err,data){
        if(err || data.length<1){
          console.log(err || '订单不存在!');
          cb("订单查询失败！")
        }else{
          cb(null,data[0])
        }
      })
    },function(order,cb){
      //检测商品状态是否锁定
      if(order.state == 1){
        cb("锁定状态，不允许修改！")
      }else{
        cb(null,order)
      }
    },function(order,cb){
      //验证商品实际存储量是否足够
      commoditDao.findById(commoditId,function(err,data){
        if(err || !data.sum){
          console.log(err || '商品不存在!');
          cb('商品不存在!')
        }else{
          cb(null,order,data.sum)
        }
      })
    },function(order,commoditSum,cb){
      var total = 0;
      for(var i in order.commoditsList){
        if(order.commoditsList[i].id == commoditId && amount <= commoditSum){
          order.commoditsList[i].amount = amount;   
        }else{
          amount = commoditSum;
          order.commoditsList[i].amount = commoditSum;
        }
        total = total + order.commoditsList[i].amount*order.commoditsList[i].price;
        // console.log(total)
      }
      order.total = total;
      orderDao.update(order._id,order,function(err,data){
        if(err){
          console.log(err);
          cb("变更商品数量失败！")
        }else{
          cb(null,commoditSum,data);
        }
      })
    }],
    function(err,commoditSum,data){
      console.log(data);
      if(err){
        console.log(err)
        res.json({message : err})
      }else{
        res.json({message : "ok",'amount' : amount})
      }
  })
});
router.get('/payTwo/:id',function(req,res){
  //锁定订单，页面显示锁定状态，
  console.log('----------payTwo-------------')
  var orderId = req.params.id;
  async.waterfall([
    function(cb){
    /*因为在付账的时候是从页面重定向的付款页面的，所以需要添加加密字段给第三方做数据完整性验证*/
    //修改订单状态,增加加密字段
    orderDao.lockingById(orderId,function(err,data){
      if(err){
        cb(err);
      }else{
        cb(null,orderId)
      }
    })
  },
  function(cb){
    orderDao.findById(orderId,function(err,data){
      if(err){
        console.log(err);
        cb("订单查询失败！");
      }else{
        cb(null, data);
      }
    })
  },function(order,cb){
    //生成商品发布者的被购买订单
    
  }],function(err,order){
    res.json({item : order})
  })  
});
router.get('/delOrderById/:id',function(req,res){
  //根据订单id查看订单
  var orderId = req.params.id;
  orderDao.delOrderById(orderId,function(err,data){
    if(err){
      console.log(err);
      res.json({message : "订单查询失败！"})
    }else{
      res.json({item : data});
    }
  })
});
router.get('/buy/:id',function(req,res){
  
})

module.exports = router;

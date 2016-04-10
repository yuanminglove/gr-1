var orderModel = require('../models/order');
var crypto = require("crypto");

var orderDao = {
  addOrder : function(order,callback){
    order = new orderModel(order);
    order.save(callback);
  },
  findById : function(id,callback){
    // orderModel.findById(id,{state : 0},function(err,data){
    orderModel.findById(id,function(err,data){
      if(err){
        console.log(err);
        callback('订单不存在！');
      }else{
        callback(null,data);
      }
    });
  },
  findBelong : function(belongId,callback){
    orderModel.find({'belong' : belongId},callback);
  },
  findByConditions : function(conditions,callback){
    orderModel.find(conditions,callback);
  },
  update : function(id,order,callback){
    if(order._id){
      delete order._id;
    }
    orderModel.update({'_id' : id},order,callback);
  },
  delOrderById : function(id,callback){
    orderModel.remove({'_id' : id},callback);
  },
  lockingById : function(id,callback){
    orderModel.findById({'_id' : id},function(err,order){
      if(err){
        callback(err);
      }else if(!order){
        callback('订单不存在！');
      }else if(false && order.state == 1){
        callback('订单已锁定！');
      }else{
        order.secret = null;//重置加密字段
        order.state = 1;//将订单锁定(还未增加删除状态位)
        var secret = crypto.createHash("md5").update(JSON.stringify(order)).digest("hex");
        orderModel.update({'_id' : id},{$set : {'secret' : secret,state : 1}},function(err,data){
          if(err){
            callback(err);
          }else{
            callback(null,data);
          }
        })
      }
    });
  }
}


module.exports = orderDao;

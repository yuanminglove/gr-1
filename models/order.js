var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var orderScheMa = new Schema({
    belong: String,
    receiverName : String,
    receiverAddress : String,
    receiverPhone : String,
    commoditsList : [{
      id : String,
      name : String,
      price : Number,
      pic : String,
      amount : Number
    }],
    total : Number,
    date : {
      type : Date,
      default : new Date()
    },
    state : {
      type : Number,
      default : 0  //0 可修改状态，1锁定状态/**订单在点击付款做重定向的时候需要先锁定订单
    },
    secret : {
      type : String,
      default : null
    }
}); 


// exports.user = mongoose.model('user', userScheMa); //  与users集合关联
module.exports = mongoose.model('order', orderScheMa , 'order');
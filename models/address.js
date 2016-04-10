var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var addressScheMa = new Schema({
    belong: String,
    receiverName : String,
    receiverPhone : String,
    receiverAddress : String,
    isDefault : Boolean
}); 


// exports.user = mongoose.model('user', userScheMa); //  与users集合关联
module.exports = mongoose.model('address', addressScheMa , 'address');
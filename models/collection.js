var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var collectionSchema = new Schema({
    // _id : String , //数据库自带  id 对象的唯一编号
    id : {  //附加 id 用作对象的基本操作和判断，默认为空,真实唯一 id 使用 _id
     type : String,
     default : ''
    },
    userId : String,
    commoditId : String
}); 


module.exports = mongoose.model('collection', collectionSchema , 'collection');
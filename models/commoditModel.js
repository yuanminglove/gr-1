var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var commoditScheMa = new Schema({
    // _id : String , //数据库自带  id 对象的唯一编号
    id : {  //附加 id 用作对象的基本操作和判断，默认为空,真实唯一 id 使用 _id
     type : String,
     default : ''
    },
    name : {  //商品名称
     type : String,
     default : '商品名称'
    },
    price : {  //商品价格
     type : Number,
     default : '666'
    },
    describe : {//商品描述
        type :　String,
        defaule : '这个铺主很懒，什么都不想写~~'
    },
    thumbnail : Array, //商品缩略图
    joinTime : {
        type : Date,  //商品加入时间，可用作商品展示排序
        default : new Date()
    },
    lastUpdateTime : Date,  //商品最后修改日期，作为商品的发布日期
    typeId : String,//商品类型id
    keyValue : Array,
    belong : String,//发布者id
    state : Number,  //商品状态（0 未发布，1 下架，2 在售，3 缺货等）
    sum : Number, //商品存货数量

}
); 


module.exports = mongoose.model('commodit', commoditScheMa , 'commodit');
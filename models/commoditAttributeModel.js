var mongoose = require("mongoose");  //  顶会议用户组件
var Schema = mongoose.Schema;    //  创建模型
var typeModel = new Schema({
	id : {  //附加 id 用作对象的基本操作和判断，默认为空,真实唯一 id 使用 _id
		type : String,
		default : ''
	},  
	parentId : {  //当前分类的上级分类 id，默认为空
		type : String,
		default : ''
	},
	name : String,  //当前类型名称
	isLast : {  //是否为叶子节点，只有叶子节点才能添加商品
		type:Boolean,
		default : false
	},
	keys : Array,//商品所具有的属性
	secert : String,//当前分类属性的md5用作校验
	indx : Number  //当前分类在同级分类中的排序标号
}); 


module.exports = mongoose.model('typeModel', typeModel , 'typeModel');
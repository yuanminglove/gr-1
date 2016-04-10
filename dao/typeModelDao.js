var typeModel = require('../models/commoditAttributeModel');
//这里要做数据非法性校验，待完善  很重要的逻辑处理  需要  async  组件
module.exports = {
	add : function(type, cb){
		type = new typeModel(type);
		type.save(cb);
	},
	update : function(type, cb){
		typeModel.update({'_id':type.id},type, function(err){
			if(err){
				console.log(err);
				cb("typeModelDao : 保存出错！")
			}else{
				cb(null)
			}
		});
	},
	deleteById : function(id, cb){
		typeModel.remove({'_id':id},cb);
	},
	findById : function(id,cb){
		typeModel.findById(id, cb);
	},
	findAll : function(cb){
		typeModel.find(cb);
	},
	findByParentId : function(parentId,cb){
		typeModel.find({'parentId' : parentId},cb)
	}
};
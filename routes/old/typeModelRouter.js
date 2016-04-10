var typeModelDao = require('../dao/typeModelDao');

module.exports = {
	add : function(type, cb){
		if(type.parentId){
			typeModelDao.findById(type.parentId,function(err,data){
				if(data){
					if(data.isLast){
						cb('当前类别不可再添加新分类！')
					}else{
						typeModelDao.add(type, cb);
					}					
				}else{
					cb('数据被修改，增加失败！');
				}
			});
		}else{
			typeModelDao.add(type, cb);
		}	
	},
	deleteById : function(id, cb){
		typeModelDao.deleteById(id,function(err){
			if(err){
				cb(err);
			}else{
				cb(null);
			}
		});
	},
	update : function(type, cb){
		typeModelDao.findById(type.id,function(err,data){
			if(data){
				typeModelDao.update(type,cb);
			}else{
				cb('数据不存在！');
			}
		});
	},
	findById : function(id, cb){
		typeModelDao.findById(id, cb)
	},
	findAll : function(cb){
		typeModelDao.findAll(cb);
	},
	findByParentId : function(parentId , cb){
		typeModelDao.findByParentId(parentId,function(err,data){
			if(!err){
				cb(null , data);
			}else{
				cb(err);
			}
		});
	}
};

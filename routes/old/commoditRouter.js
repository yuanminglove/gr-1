var commoditDao = require('../dao/commoditDao');

module.exports = {
	add : function(commodit,callback){
		if(commodit.id){
			//检查当前ID的商品是否存在（还要检查是否有权限修改）
			commoditDao.findById(commodit.id, function(err,data){
				if(data){//数据存在就跟新当前数据
					commoditDao.update(commodit, function(err,data){
						if(err){
							callback('商品修改失败！')
						}else{
							callback(null,data);
						}
					});
				}else{//数据不存在就提示用户数据不存在
					callback('数据不存在！');
				}
			});
		}else{
			commoditDao.add(commodit,function(err,data){
				if(err){
					callback('商品增加失败！');
				}else{
					callback(null,data);
				}
			});
		}
	},
	update : function(commodit, callback){
		

		
	},
	findAll : function(callback){
		commoditDao.findAll(callback);
	},
	findById : function(id, callback){

		commoditDao.findById(id, callback);
	},
	deleteById : function(id, callback){
		commoditDao.deleteById(id, callback);
	}
}
var commoditModel = require('../models/commoditModel');

module.exports = {
	add : function(commodit,callback){		
		// console.log(commodit)
		commodit = new commoditModel(commodit);
		commodit.save(function(err,data){
			if(err){
				// console.log('------commoditDao------')
				console.log(err);
				callback(err);
			}else{
				callback(null,data);
			}
		});
	},
	update : function(commodit, callback){
		commoditModel.update({'_id':commodit.id}, commodit, function(err,data){
			if(err){
				// console.log('----- commoditDao -----');
				console.log(err);
				callback('update 出错');
			}else{
				// console.log('update 成功 : ');
				console.log(data);
				// console.log('-----------------');
				callback(null)
			}
		});
	},
	findAll : function(callback){
		commoditModel.find({},function(err, data){
			if(err){
				// console.log('----- commoditDao -----');
				console.log(err);
				callback('commoditDao 出错');
			}else{
				callback(null, data);
			}
		});
	},
	findAllList : function(option,callback){
		option = option || {};

		console.log(option)
		commoditModel.find(option,'_id name price typeId joinTime',function(err, data){
			if(err){
				// console.log('----- commoditDao -----');
				console.log(err);
				callback('commoditDao 出错');
			}else{
				callback(null, data);
			}
		});
	},
	findById : function(id, callback){
		console.log('commoditDao findById : ' + id);
		commoditModel.findById(id, function(err, data){
			if(err){
				console.log(err);
				callback("commoditDao 出错")
			}else{
				callback(null, data);
			}
		});
	},
	findByConditions : function(conditions, callback){
		// console.log('commoditDao conditions : ');
		// console.log(conditions);
		commoditModel.find(conditions, function(err, data){
			if(err){
				console.log(err);
				callback("commoditDao 出错")
			}else{
				callback(null, data);
			}
		});
	},
	deleteById : function(id, callback){
		commoditModel.remove({'_id':id}, function(err,data){
			if(err){
				console.log(err);
				callback(true);
			}else{
				callback(null,data);
			}
		});
	},
	commoditsByPage : function(page, callback){
		// console.log('------commoditDao------')
		// console.log(page)
		var option = {
			limit : parseInt(page.pageSize),
			skip : parseInt(page.pageSize*page.currentPage)
		}
		commoditModel.find({},null,option,function(err, data){
			if(err){
				console.log(err);
				callback(err);
			}else{
				// console.log(data)
				callback(null, data);
			}
		});
	},
	commoditsInfoByID : function(id, callback){
		// console.log('------commoditDao------')
		commoditModel.find({_id : id},'_id name price thumbnail belong',function(err, data){
			if(err){
				console.log(err);
				callback(err);
			}else{
				// console.log(data)
				callback(null, data);
			}
		});		
	},
	commoditsInfoByIDs : function(id, callback){
		// console.log('------commoditDao------')
		commoditModel.find({_id : {$in : id}},'_id name price thumbnail belong state',function(err, data){
			if(err){
				console.log(err);
				callback(err);
			}else{
				// console.log(data)
				callback(null, data);
			}
		});		
	},
	commoditsInfoByPage : function(conditions,fields,options, callback){
		// console.log('------commoditDao------')
		// console.log(page)
		options = {
			pageSize : parseInt(options.pageSize),
			currentPage : parseInt(options.currentPage)
		}
		options = {
			limit : options.pageSize>1 ? options.pageSize : 10,
			skip : options.pageSize*(options.currentPage>0 ? options.currentPage-1 : 0)
		}
		commoditModel.find(conditions || {},'_id name price thumbnail state',options,function(err, data){
			if(err){
				console.log(err);
				callback(err);
			}else{
				// console.log(data)
				callback(null, data);
			}
		});		
	},
	publish : function(id,update ,options,callback){
		commoditModel.findOneAndUpdate(id,update,options,function(err,data){
			if(err){
				console.log('Dao publish : ');
				console.log(err);
				callback('Dao publish.--------');
			}else{
				callback(null,data);
			}
		})
	}
}



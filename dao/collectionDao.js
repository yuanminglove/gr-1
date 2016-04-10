var collectionModel = require('../models/collection');

var collectionDao = {
  add : function(collection,callback){
    collection = new collectionModel(collection);
    collection.save(callback);
  },
  findByUser : function(userId,callback){
    collectionModel.find({userId : userId},function(err,data){
      if(err){
        console.log(err);
        callback("查询失败！")
      }else{
        callback(null,data);
      }
    })
  },
  deleteByCommoditId : function(id,callback){
    collectionModel.remove({'commoditId' : id},function(err,data){
      if(err){
        console.log(err);
        callback(err)
      }else{{
        callback(null,data);
      }}
    })
  },
  findByOptions : function(conditions,callback){
    collectionModel.find(conditions,function(err,data){
      if(err){
        console.log(err);
        callback(err)
      }else{{
        callback(null,data);
      }}
    })
  }
}


module.exports = collectionDao;

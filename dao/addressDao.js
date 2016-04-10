var addressModel = require('../models/address');

var addressDao = {
  addAddress : function(address,cb){
    console.log(address)
    address = new addressModel(address);
    address.save(address,cb);
  },
  findByUserId : function(userId,cb){
    addressModel.find({'belong' : userId},cb);
  },
  findByConditions : function(conditions,cb){
    addressModel.find(conditions,cb);
  },
  delAddress : function(conditions,cb){
    addressModel.remove(conditions,cb);
  },
  setDefaultAddress : function(c,cb){
    addressModel.findOneAndUpdate({'belong' : c.belong,'isDefault' : true },{$set : {'isDefault' : false}},null,function(err){
      if(err){
        cb(err);
      }else{
        addressModel.findOneAndUpdate({'belong' : c.belong,'_id' : c._id },{$set : {'isDefault' : true}},null,function(err,data){
          if(err){
            cb(err)
          }else{
            cb(null,data)
          }
        });
      }
    })
  }
}


module.exports = addressDao;

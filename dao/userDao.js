var userModel = require('../models/userModel');

var userDao = {
	addUser : function(user,callback){
		user = new userModel(user);
		user.save(callback);
	},
	user : function(userID,callback){
		userModel.find({},callback);
	},
  findByUserName : function(userName, callback){
    userModel.findOne({userName:userName},callback);
  },
  findById : function(id, callback){
    userModel.findById(id,callback);
  }
}


module.exports = userDao;

var async = require('async');
var req2 = require('../utils/req2');

//router
var common = require('./common');
var user = require('./user');
var admin = require('./admin');

module.exports = function(app){ 


  app.use('/u', user);//用户路由

  app.use('/a', admin);//管理员路由

  app.use('/c', common);//公共路由
	/*-------------------------------index-------------------------------*/
	app.get('/', function(req , res){
		res.render('index');
	});


};  
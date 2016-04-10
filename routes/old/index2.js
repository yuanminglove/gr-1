
var commoditRouter = require('./commoditRouter');
var typeModelRouter = require('./typeModelRouter');
var user = require('./user')
var req2 = require('../utils/req2');

module.exports = function(app){  
	app.use('/user', user);
	app.get('/401',function(req,res){

		var authorization=res.getHeader("WWW-Authenticate");

		console.log(authorization)
		if(authorization){
			res.end(authorization);
		}else{
			res.writeHead(401, {'WWW-Authenticate': 'Basic realm='});
			res.end();
		}
	});
	/*---------------------------------商品路由----------------------------------------------------*/
	app.get('/commoditAdd',function(req, res){
		if(req.query.isLast){
			typeModelRouter.findById(req.query.id,function(err,data){
				res.render('commoditCRUD' , { title : '增加商品',type : data});
			});
		}else{
			//获取新增商品页
			typeModelRouter.findByParentId(req.query.parentId || null,function(err,data){				
					res.render('commoditCRUD', { title : '选择商品分类' , types : data});						
			});	
		}	
	});
	app.post('/commoditAdd',function(req, res){//新增和修改商品
		req2.commodit(req, function(commodit){	
			commoditRouter.add(commodit, function(err, commodit){
				res.render('index', { title: err||'增加/修改成功！' , commodit : commodit});				
			});
		});
		
	});	
	app.get('/commoditUpdate/:id',function(req, res){// 商品信息修改页
		commoditRouter.findById(req.params.id,function(err, data){
			res.render('commoditCRUD', { title : '修改商品' , commodit : data});
		});
	});
	app.get('/commodit',function(req, res){//查看所有商品
		commoditRouter.findAll(function(err, data){
			res.render('index', { title : '查看商品', commodits : data})
		});		
	});
	app.get('/commodit/:id',function(req, res){//根据id查看商品
		commoditRouter.findById(req.params.id,function(err, data){
			// if(err)console.log(err)
			res.render('index', { title : '查看单个商品', commodit : data})
		});		
	})
	app.get('/commoditDel/:id',function(req, res){//根据id删除商品
		commoditRouter.deleteById(req.params.id, function(err, data){
			res.render('index' , { title : '删除成功！'})
		});
	});
	
	/*---------------------------------商品路由结束----------------------------------------------------*/
	/*---------------------------------商品类型路由----------------------------------------------------*/
	app.get('/type',function(req, res){
		typeModelRouter.findByParentId(req.query.parentId || null,function(err, data){
			if(!err){
				res.render('index' , { title : '根据parentId的遍历' , types : data});
			}else{
				res.render('index' , { title : err});
			}

		});
	});
	app.get('/type/:id',function(req, res){
		typeModelRouter.findById(req.params.id, function(err, data){
			res.render('index' , { title :data})
		});
	});
	app.get('/typeAdd',function(req, res){
		res.render('typeCRUD' , { title : '增加type的页面' });
	});
	app.post('/typeAdd',function(req, res){	
		req2.type_(req,function(err, data){
			if(data.id){
				typeModelRouter.update(data, function(err, data){
					if(!err){
						res.redirect('/type');
					}else{
						res.render('typeCRUD' , { title : err });
					}	
				});

			}else{
				typeModelRouter.add(data, function(err,data){
					if(!err){
						res.redirect('/type');
					}else{
						res.render('typeCRUD' , { title : err });
					}				
				});	
			}
				
		});
	});
	app.get('/typeAdd/:id',function(req, res){
		//增加子分类，id为父分类的id
		typeModelRouter.findById(req.params.id, function(err, data){
			if(!data){
				res.render('index' , { title : '上级分类不存在！'});
			}else{
				console.log(data);
				res.render('typeCRUD' , { title : '增加子分类！',parentId : data._id});
			}
			
		});		
	});
	app.get('/typeDel/:id',function(req, res){
		typeModelRouter.deleteById(req.params.id,function(err){
			if(err){
				res.render('index' , { title : err});
			}else{
				res.render('index' , { title : '删除成功！'})
			}
		});
	});
	app.get('/typeUpdate/:id',function(req, res){
		typeModelRouter.findById(req.params.id,function(err, data){
			if(err){
				res.render('index' , { title : err});
			}else{
				res.render('typeCRUD' , { title : '修改type', type : data});
			}
		});
	});
	/*---------------------------------商品类型路由结束----------------------------------------------------*/
	app.get('/f',function(req,res){  
		res.render('page/'+req.query.p, { title: 'Express' });  
	});
	app.get('/admin',function(req,res){
		res.render('admin/'+req.query.p, { title: 'Express' });
	});
	// //用户注册
	// app.get('/register', function(req, res) {
	// 	var user = {'userName':'chris'};
	
	// }); 
	// app.post('/register', function(req, res) {

	// });
	// //根据ID获取一个用户
	// app.get('/user',function(req,res){

	// });
	/*****************页面跳转测试路由*******************/
	
	/*****************页面跳转测试路由结束*******************/
};  
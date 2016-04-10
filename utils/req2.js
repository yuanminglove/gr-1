var crypto = require("crypto");
var utils = {
	user : function(req,callback){
		var user = {
			userName : req.body.userName
		}
		callback(user);
	},
	commodit : function(req, callback){
		var commodit = {
			id : req.body.id || null,	
			name : req.body.name,
			price : req.body.price,
			type_ : {
				name : req.body.typeName,
				keyValue : new Array()
			},
			joinTime : new Date().Format("yyyy-MM-dd hh:mm:ss")
		}
		var i = 0;

		while(req.body['key' + i]){
			commodit.type_.keyValue.push({ key : [req.body['key' + i]], value : req.body['value' + i]});
			i++
		}
		console.log(commodit)
		callback(commodit);
	},
	type_ : function(req, callback){
		var type = {
			id : req.body.id || null,
			parentId : req.body.parentId || null,
			name : req.body.name,
			key : req.body.key,
			isLast : req.body.isLast || false

		}
		// for(var val in req.body.key){
		// 	// type.key.push(req.body.key[val])
		// 	console.log(req.body.key[val])
		// }
		// var str = '';
		// for(var val in type.key){
		// 	str+=type.key[val];
		// }
		type.secert = crypto.createHash("md5").update(type.key.toString()).digest("hex");
		// console.log(str +'  '+type.secert);
		callback(null , type);
	}
}

Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
	    "M+": this.getMonth() + 1, //月份 
	    "d+": this.getDate(), //日 
	    "h+": this.getHours(), //小时 
	    "m+": this.getMinutes(), //分 
	    "s+": this.getSeconds(), //秒 
	    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	    "S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;

}
module.exports = utils;
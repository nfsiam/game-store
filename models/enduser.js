var db = require('./db');


module.exports ={

	get: function(id, callback){
		var sql = "select * from enduser where username='"+username;
		db.getResults(sql, function(result){
			if(result.length > 0){
				callback(result);
			}else{
				callback([]);
			}
		});
	},
	getAll: function(id, callback){
		var sql = "select * from username";
		db.getResults(sql, function(result){
			if(result.length > 0){
				callback(result);
			}else{
				callback([]);
			}
		});
	},
	
	insert: function(product, callback){
		var sql = "insert into username values('', "+username.username_name+", "+username.username_firstname+", "+username.username_lastname+","+username.username_email+","+username.username_phonenumber+","+username.username_propic+","+username.username_dateofbath+","+username.username_bio+")";
		db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},
	update: function(product, callback){
		var sql = "";
		db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},
	delete: function(id, callback){
		var sql = "delete from product where id="+id;
		db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	}
}
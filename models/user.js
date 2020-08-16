var db = require('./db');

module.exports ={

	get: function(id, callback){
		var sql = "select * from user where username=?";
		db.getResults(sql, [username], function(result){
			if(result.length > 0){
				callback(result[0]);
			}else{
				callback([]);
			}
		});
	},

	getAll: function(callback){
		var sql = "select * from user";
		db.getResults(sql, null,  function(result){
			if(result.length > 0){
				callback(result);
			}else{
				callback([]);
			}
		});
	},

	validate: function(user, callback){
		var sql = "select * from user where username=? and password=?";
		db.getResults(sql, [user.username, user.password], function(result){
			if(result.length > 0){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	insert: function(user, callback){
		var sql = "insert into user values( ?, ?, ?)";

		db.execute(sql, [user.username, user.password, user.role], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	update: function(user, callback){
		var sql = "update user set  password=?, role=? where username=?";
		db.execute(sql, [user.password, user.role, user.username], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	delete: function(id, callback){
		var sql = "delete from user where username=?";
		db.execute(sql, [username], function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
		});
	}
}
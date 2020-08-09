var db = require('./db');

module.exports =
{

	get: function(user, callback){
		var sql = "select * from alluser where username="+user.username+" and password="+user.password;
		db.getResults(sql, function(result){
			if(result.length > 0){
				callback(true);
			}else{
				callback(false);
			}
		});
	},

	
}
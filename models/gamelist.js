var db = require('./db');
const fileUpload = require('express-fileupload');


module.exports =
{
	publish: (user, callback)=>{

		var sql = "insert into gamelist values ('','"+user.gametitle+"','"+user.publisher+"','"+user.publishdate+"','"+user.price+"','"+user.gamelocation+"','"+user.gamepicture+"','n/a','n/a','n/a') "  ; 
		console.log(sql);
		db.execute(sql, (result)=>{
			
			if(result.length > 0)
			{
				callback(true);
			}
			else{
				callback(false);
			}
		});
	},
}
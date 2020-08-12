var db = require('./db');

module.exports =
{
    sentRequest: (user,amount, callback)=>{

		var sql = "insert into rechargerequest values ('','"+user+"','n/a','"+amount+"' , 'pending') ";
		console.log(sql);
		db.execute(sql, (result)=>{

			if(result)
			{
				callback(true);
			}
			else{
				callback(false);
			}
		});
    },
}
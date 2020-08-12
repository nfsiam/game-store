var db = require('./db');

module.exports =
{
    sendRechareNotification: (user,status,refid, callback)=>{
        var sql= "insert into notification values ('','"+status+"','"+refid+"','"+user+"') ";
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
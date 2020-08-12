var db = require('./db');

module.exports =
{
    createWallet: (user, callback)=>{

		var sql = "insert into wallet values ('','"+user+"', '0') ";
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
    getCurrentBalance: (user, callback)=>{

		var sql = "select * from wallet where username='"+user+"'  ";
		console.log(sql);
		db.getResults(sql,(result)=>{
			if(result.length>0)
			{
				callback(result);
			}
			else
			{
				callback([]);
			}
		});
    },
}
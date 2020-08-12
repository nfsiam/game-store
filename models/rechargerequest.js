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
	getAllRequest:(user,callback)=>{
		var sql="select * from rechargerequest ";
		console.log(sql);
		db.getResults(sql,(result)=>{
			console.log("Call back called !"+result.length);
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

	updateRequest:(user,id,status,callback)=>{
		var sql = "update rechargerequest set approvedby='"+user+"',status='"+status+"' where id='"+id+"' ";
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
	}
}
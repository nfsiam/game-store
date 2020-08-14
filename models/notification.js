var db = require('./db');

module.exports =
{
    sendRechareNotification: (user,status,refid, callback)=>{
        var sql= "insert into notification values ('','"+status+"','"+refid+"','"+user+"') ";
        console.log(sql);
		db.execute(sql, (status)=>{

			if(status)
			{
				callback(true);
			}
			else{
				callback(false);
			}
		});
	},

	getNotification:(user,callback)=>{
		var sql="select notification.id, notification.type ,notification.referencid,notification.username , rechargerequest.approvedby,rechargerequest.amount,rechargerequest.status from notification inner join rechargerequest on notification.referencid=rechargerequest.id where notification.username='"+user+"'";
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
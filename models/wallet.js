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
	
	updateBalance:(user,balance,callback)=>{

		var updatedBalance;
		var currentBalance= "select * from wallet where username='"+user+"'  ";
		console.log(currentBalance);
		db.getResults(currentBalance,(result)=>{
			if(result.length>0)
			{
				//callback(result);
				updatedBalance=result[0].amount+balance;
				var sql = "update wallet set amount= '"+updatedBalance+"' where username='"+user+"'  ";
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
		});
	},
	updateBalanceAfterPurchase:(user,balance,callback)=>{
		var sql = "update wallet set amount= '"+balance+"' where username='"+user+"'  ";
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
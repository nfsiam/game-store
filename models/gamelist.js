var db = require('./db');
const fileUpload = require('express-fileupload');
const e = require('express');


module.exports =
{
	publish: (user, callback)=>{

		var sql = "insert into gamelist values ('','"+user.gametitle+"','"+user.publisher+"','"+user.publishdate+"','"+user.price+"','"+user.gamelocation+"','"+user.gamepicture+"','n/a','n/a','n/a') "  ; 
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
	insertToCart:(id,user,callback)=>{
		var sql= "insert into cart values ('','"+id+"','"+user+"')";
		console.log(sql);
		db.execute(sql,(result)=>{
			if(result)
			{
				callback(true);
			}
			else
			{
				callback(false);
			}
		});
	},
	geAllGames:(user,callback)=>{
		var sql="select * from gamelist";
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
	

	geAllGamesByUser:(user,callback)=>{
		var sql="select * from gamelist where publisher='"+user+"' ";
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
}
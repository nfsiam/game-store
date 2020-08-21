var express 	= require('express');
var router 		= express.Router();
var transactionModel = require.main.require("./models/transaction");
var gamelistModel = require.main.require("./models/gamelist");
var gamesalestatsModel =require.main.require("./models/gamesalestats");


router.get('/', function(req, res){

	if(req.cookies['user']!=null)
	{
		var gamelist = {
			username:req.cookies['user'].username,
			gamename:[],
			price:[],
			totalpurchase:'',
			gameid:[]
		};
		gamelistModel.geAllGamesByUser(req.cookies['user'].username,(result)=>{

			if(result.length>0)
 			{
					for(var i=0;i<result.length;i++)
					{
						gamelist.gamename.push(result[i].gametitle);
						gamelist.price.push(result[i].price);
						gamelist.gameid.push(result[i].gameid);
						
					}
					for(var i=0;i<gamelist.gameid.length;i++)
					{	
						console.log("game id "+gamelist.gameid[i]);
						console.log("game gametitle "+gamelist.gamename[i]);
						console.log("game price "+gamelist.price[i]);

						gamesalestatsModel.insert(req.cookies['user'].username,gamelist.gameid[i],gamelist.price[i],gamelist.gamename[i],(status)=>{
							if(!status)
							{
								console.log("Stats for game already exists");
							}
						});
						transactionModel.getAllTransactionByGameId(gamelist.gameid[i],(transactionResult)=>{
							gamelist.totalpurchase=transactionResult.length;
							//console.log(transactionResult);
							if(transactionResult.length>0)
							{
								var gmid = transactionResult[0].gameid;
								console.log(gmid);
								gamesalestatsModel.update(gmid,gamelist.totalpurchase,(status)=>{
										if(status)
										{
											console.log("status updated ");
										}
										else
										{
											console.log("status not updated");
										}
								});
							}
						});	
					}
			}
		});
		gamesalestatsModel.getAll(gamelist.username,(result)=>{
			res.render('publisher/home',{result});
		});
	}
	else
	{
		res.redirect('/login');
	}
});

module.exports = router;
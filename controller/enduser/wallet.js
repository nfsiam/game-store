var express 	= require('express');
const { Result } = require('express-validator');
var router 		= express.Router();
var enduserModel= require.main.require("./models/enduser.js");
var rechargerequestModel = require.main.require("./models/rechargerequest.js");
var walletModel= require.main.require("./models/wallet.js");

var err= {
	balance:'',
	success:-1
}

var userinfo =
{
	username:'',
	propic:'',
	bio:'',
	balance:''
}

router.get('/', function(req, res){
	if(req.cookies['user']!=null)
	{
		userinfo.username='';
		userinfo.propic='';
		userinfo.bio='';
		userinfo.balance='';
	
		enduserModel.getprofileinfo(req.cookies['user'].username,(result)=>{
			if(result.length==1)
			{
				err.success=-1;
				if(req.cookies['user'].username!=null)
				{
					userinfo.username=req.cookies['user'].username;
					userinfo.propic=result[0].propic;
					userinfo.bio=result[0].bio;
	
					walletModel.getCurrentBalance(req.cookies['user'].username,(results)=>{
						if(results.length==1)
						{
							userinfo.balance=results[0].amount;
							res.render('enduser/wallet',{err,userinfo});
						}
						else
						{
							res.redirect('/login');
						}
					});
				}
				else
				{
					res.redirect('/login');
				}
			}
			else
			{
				res.redirect('/login');
			}
			//console.log("result length is "+result.length);
	
		});
	
		/* userinfo.username=req.session.username;
		propic */
		
	}
	else
	{
		res.redirect('/login');
	}
	

});

router.post('/', function(req, res){

	userinfo.username='';
	userinfo.propic='';
	userinfo.bio='';
	userinfo.balance='';

	if(req.body.amount<=0 || isNaN(req.body.amount))
	{
		err.success=0;
	}
	else
	{
		err.success=1;
	}

	if(req.cookies['user'].username!=null)
	{
		if(err.success==1)
		{
			rechargerequestModel.sentRequest(req.cookies['user'].username,req.body.amount,(status)=>{
				if(status)
				{
					enduserModel.getprofileinfo(req.cookies['user'].username,(result)=>{
						if(result.length==1)
						{
							//err.success=-1;
							if(req.cookies['user'].username!=null)
							{
								userinfo.username=req.cookies['user'].username;
								userinfo.propic=result[0].propic;
								userinfo.bio=result[0].bio;
				
								walletModel.getCurrentBalance(req.cookies['user'].username,(results)=>{
									if(results.length==1)
									{
										userinfo.balance=results[0].amount;
										res.render('enduser/wallet',{err,userinfo});
									}
									else
									{
										res.redirect('/login');
									}
								});
							}
							else
							{
								res.redirect('/login');
							}
						}
						else
						{
							res.send("<h1>Server Crashed</h1>");
						}
				
					});
				}
				else
				{
					res.send("<h1>Server Error Please try Again</h1>");
				}
		});

		}
		else
		{
			enduserModel.getprofileinfo(req.cookies['user'].username,(result)=>{
				if(result.length==1)
				{
					//err.success=-1;
					if(req.cookies['user'].username!=null)
					{
						userinfo.username=req.cookies['user'].username;
						userinfo.propic=result[0].propic;
						userinfo.bio=result[0].bio;
		
						walletModel.getCurrentBalance(req.cookies['user'].username,(results)=>{
							if(results.length==1)
							{
								userinfo.balance=results[0].amount;
								res.render('enduser/wallet',{err,userinfo});
							}
							else
							{
								res.redirect('/login');
							}
						});
					}
					else
					{
						res.redirect('/login');
					}
				}
				else
				{
					res.send("<h1>Server Crashed</h1>");
				}
		
			});
		}
		
	}
	else
	{
		res.redirect('/login');
	}
	

});


module.exports = router;
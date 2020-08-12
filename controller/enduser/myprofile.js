var express 	= require('express');
var router 		= express.Router();
var modelEnduser =  require.main.require("./models/enduser.js");
var walletModel = require.main.require("./models/wallet.js");

router.get('/', function(req, res){

	if(req.session.username!=null)
	{
		var dispData = {
			username:req.session.username,
			firstname:'',
			lastname:'',
			propic:'',
			currentbatch:'',
			contributionpoints:'',
			totalownedgames:'',
			currentplan:'',
			bio:'',
			balance:''
		}
		modelEnduser.getprofileinfo(req.session.username,(results)=>{
			console.log("Result for getProfileInfo"+results.length);
			if(results.length==1)
			{
				dispData.firstname=results[0].firstname;
				dispData.lastname=results[0].lastname;
				dispData.propic=results[0].propic;
				dispData.bio=results[0].bio;
				walletModel.getCurrentBalance(dispData.username,(result)=>{

					
					dispData.balance=result[0].amount;
					console.log("Balance is "+dispData.balance);
					res.render('enduser/myprofile',{dispData});

				});
			}
			else
			{
				res.send("<h1>Something was wrong !!!</h1>");
			}
		});
		
	}
	else
	{
		res.redirect('/login');
	}
	
});

module.exports = router;
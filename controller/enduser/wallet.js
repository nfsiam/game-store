var express 	= require('express');
var router 		= express.Router();
var rechargerequestModel = require.main.require("./models/rechargerequest.js");
var err= {
	balance:'',
	success:-1
}

router.get('/', function(req, res){

	err.success=-1;
	if(req.session.username!=null)
	{
		res.render('enduser/wallet',{err});
	}
	else
	{
		res.redirect('/login');
	}
	

});

router.post('/', function(req, res){

	if(req.body.amount<=0 || isNaN(req.body.amount))
	{
		err.success=0;
	}
	else
	{
		err.success=1;
	}

	if(req.session.username!=null)
	{
		rechargerequestModel.sentRequest(req.session.username,req.body.amount,(status)=>{
				if(status)
				{
					res.render('enduser/wallet',{err});
				}
				else
				{
					res.send("<h1>Server Error Please try Again</h1>");
				}
		});
		
	}
	else
	{
		res.redirect('/login');
	}
	

});


module.exports = router;
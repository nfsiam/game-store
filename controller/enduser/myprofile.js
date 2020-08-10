var express 	= require('express');
var router 		= express.Router();
var modelEnduser =  require.main.require("./models/enduser.js");


router.get('/', function(req, res){

	if(req.session.username!=null)
	{
		modelEnduser.getprofileinfo(req.session.username,(results)=>{
			console.log("Result for getProfileInfo"+results.length);
			if(results.length==1)
			{
				res.render('enduser/myprofile',{results});
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
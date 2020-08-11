var express 	= require('express');

var router 		= express.Router();
var getAllUserModel = require.main.require('./models/enduser.js')

router.get('/', function(req, res){

	if(req.session.username!=null)
	{
		getAllUserModel.getAllUser(req.session.username,(results)=>{

			console.log(results.length);
			res.render('enduser/connect',{results});
		});
	
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
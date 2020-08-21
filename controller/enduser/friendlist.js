var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){

	
	if(req.cookies['user']!=null)
	{
		res.render('enduser/friendlist');
	}
	else
	{
		res.redirect('/login');
	}
	

});

module.exports = router;
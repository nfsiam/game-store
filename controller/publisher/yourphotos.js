var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){

	if(req.cookies['user']!=null)
	{
		res.render('publisher/yourphotos');
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
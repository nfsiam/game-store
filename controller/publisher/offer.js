var express 	= require('express');
var router 		= express.Router();
var model

router.get('/', function(req, res){

	res.redirect("/publisher/library");
	
});

router.get('/:id', function(req, res){


	if(req.session.username!=null)
	{
		res.render('publisher/patch',req.params.id);
	}
	else
	{
		res.redirect('/login');
	}

});


module.exports = router;
var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){


	/* if(req.session.username!=null)
	{
		res.render('publisher/patch');
	}
	else
	{
		res.redirect('/login');
	} */
	res.redirect("/publisher/library");

});

router.get('/:id', function(req, res){


	if(req.cookies['user']!=null)
	{
		res.render('publisher/patch',req.params.id);
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
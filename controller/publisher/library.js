var express 	= require('express');
var router 		= express.Router();
var gamelistModel = require.main.require('./models/gamelist.js');

router.get('/', function(req, res){


	if(req.session.username!=null)
	{
		gamelistModel.geAllGamesByUser(req.session.username,(results)=>{
			
			res.render('publisher/library',{resultss:results});
		});
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
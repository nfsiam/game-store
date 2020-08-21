var express 	= require('express');
const gamelist = require('../../models/gamelist');
var router 		= express.Router();
var gamelistModel = require.main.require('./models/gamelist.js');

router.get('/', function(req, res){

	if(req.cookies['user']!=null)
	{
		gamelistModel.geAllGames(req.cookies['user'].username,(results)=>{
			
			res.render('publisher/store',{results});
		});
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
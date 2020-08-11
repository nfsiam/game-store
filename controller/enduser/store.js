var express 	= require('express');
var router 		= express.Router();
var gamelistModule = require.main.require('./models/gamelist.js');

router.get('/', function(req, res){

	if(req.session.username!=null)
	{
		gamelistModule.geAllGames(req.session.username,(result)=>{
			if(result.length>0)
			{
				res.render('enduser/store',{result});
			}
			else
			{
				res.send("<h1>Server Crashed </h1>");
			}
		});
	}
	else
	{
		res.redirect('/login');
	}
	

});

router.get('/cart/:id',function(req,res)
{
	if(req.session.username!=null)
	{
		var message={
			success:false
		}
		gamelistModule.insertToCart(req.params.id,req.session.username, function(result){
			message.success=true;
			console.log("Inserted to cart!");
		});
	}
	else
	{
		res.redirect('/login');
	}

	
});

module.exports = router;
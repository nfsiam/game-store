var express 	= require('express');
var router 		= express.Router();
var gamelistModule = require.main.require('./models/gamelist.js');
var cartModel =  require.main.require("./models/cart.js");
var message={
	success:true
};

router.get('/', function(req, res){

	if(req.cookies['user']!=null)
	{
		gamelistModule.geAllGames(req.cookies['user'].username,(result)=>{
			if(result.length>0)
			{
				var name = {username:req.cookies['user'].username};
				message.success=null;
				//console.log("I am here 123"+message.success);
				
				res.render('enduser/store',{result,message,name});
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
	if(req.cookies['user'].username!=null)
	{
		cartModel.getCartItemById(req.cookies['user'].username,req.params.id,function(result){
			
			if(result.length<1)
			{
				
				gamelistModule.insertToCart(req.params.id,req.cookies['user'].username, function(result){
					var message=true;
					
					/* console.log("I am here 123"+message);
					res.render('enduser/store',{result,message});
					console.log("Inserted to cart!"); */
					res.send("<script>alert('Added');</script>");
				});
			}
			else
			{
				gamelistModule.geAllGames(req.cookies['user'].username,(result)=>{
					if(result.length>0)
					{
						/* message.success=true;

						console.log("I am here 444"+message.success);
						res.render('enduser/store',{result,message}); */
						res.send("<script>alert('Already in cart');</script>");
					}
					else
					{
						res.send("<h1>Server Crashed </h1>");
					}
				});
				
			}

		});

	}
	else
	{
		res.redirect('/login');
	}

	
});

module.exports = router;
var express 	= require('express');
var router 		= express.Router();
var cartModel =  require.main.require("./models/cart.js");

router.get('/getitems', function(req, res){
	
	if(req.session.username!=null)
	{
        cartModel.getItems(req.session.username,(result)=>{
			
            res.send(result);
            
        });
		
	}
	else
	{
		res.redirect('/login');
	}
	

});

module.exports = router;
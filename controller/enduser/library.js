var express 	= require('express');
var router 		= express.Router();
var libraryModel =  require.main.require("./models/library.js");

router.get('/', function(req, res){
	

	
		if(req.cookies['user']!=null)
		{
			libraryModel.getAllByUser(req.cookies['user'].username,(result)=>{
				res.render("enduser/library",{result});
			});
			
		}
		else
		{
			res.redirect('/login');
		}
	
	

});

module.exports = router;
var express 	= require('express');
var router 		= express.Router();
var libraryModel =  require.main.require("./models/library.js");

router.get('/', function(req, res){
	

	libraryModel.getAllByUser(req.session.username,(result)=>{
		if(req.session.username!=null)
		{
			res.render("enduser/library",{result});
			
		}
		else
		{
			res.redirect('/login');
		}
	});
	
	

});

module.exports = router;
var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){

	res.render('enduser/myprofile');

});

module.exports = router;
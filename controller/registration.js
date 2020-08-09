var express 	= require('express');
var userModel 	= require.main.require('./models/alluser.js');
var router 		= express.Router();

router.get('/', function(req, res){
	res.render('registration');
});


router.post('/', function(req, res){


});

module.exports = router;
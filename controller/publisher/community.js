var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){

	res.render('publisher/community');

});

module.exports = router;
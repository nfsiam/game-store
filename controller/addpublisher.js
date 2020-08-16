var express 	= require('express');
var alluserModel 	= require.main.require('./models/alluser');
var router 		= express.Router();

router.get('/', function(req, res){
	res.render('home/addpublisher');
});



module.exports = router;
var express 	= require('express');
var userModel 	= require.main.require('./models/alluser.js');
var router 		= express.Router();

router.get('/', function(req, res){
	res.render('index');
});


router.post('/', function(req, res){
/* 
	var user = {
		username: req.body.username,
		password: req.body.password
	};

	userModel.get(user, function(status){
		if(status){
			req.session.username = user.username;
			res.redirect('/enduser/home');
		}else{
			res.send('invalid username/password');
		}
	}); */
	if(req.body.username=="ksq")
	{
		res.redirect('/home');
	}
	else
	{
		console.log(req.body.username);
		res.redirect('/publisher/home');
	}
	

});

module.exports = router;
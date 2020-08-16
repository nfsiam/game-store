var express 	= require('express');
var alluserModel 	= require.main.require('./models/alluser');
var router 		= express.Router();

router.get('/', function(req, res){
	res.render('login/index');
});

router.post('/', function(req, res){
/* var ab="asd";
console.log(ab); */
	 var userinfo = {
		username:req.body.username,
		password:req.body.password
	};
	
	console.log("userinfo"+userinfo);
	
	/*  alluserModel.validate(userinfo, function(status){
		if(status){
			req.session.username = user.username;
			res.redirect('/home');
		}else{
			res.send('invalid username/password');
		}
	}); 
  */
});

module.exports = router;
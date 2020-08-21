var express 	= require('express');
var allUserModel 	= require.main.require('./models/alluser.js');
var router 		= express.Router();

console.log("In Controller / login ");

var err = {  
	errormessage:''
};

router.get('/', function(req, res){
	err.errormessage="";
	res.render('index',err);
	console.log("GET Request");
});


router.post('/', function(req, res)
{
	console.log("POST Request");
	var user= {
		username:req.body.username,
		password:req.body.password,
		role:null,
	};

	allUserModel.validate(user,(status)=>{
		if(status)
		{
			/* req.session.username=user.username;
			req.session.role=user.role; */
			res.cookie('user', {
                username: user.username,
                role: user.role
			});
		/* 	console.log('lol',{
                username: user.username,
                role: user.role
			}); */
		/* 	console.log(req.cookies['user']); */

			if(user.role=="enduser")
			{
				res.redirect("/home");
			}
			else if(user.role=="publisher")
			{
				res.redirect("/publisher/home");
			}
			else if(user.role=="admin")
			{
				res.redirect("/admin/home");
			}
		}
		else
		{
			err.errormessage='invalid username or password';
			res.render('index',err);
		}
	});
});

module.exports = router;
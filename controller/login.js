var express 	= require('express');
var allUserModel 	= require.main.require('./models/alluser.js');
var router 		= express.Router();

router.get('/', function(req, res){
	res.render('index');
});


router.post('/', function(req, res)
{
	var user= {
		username:req.body.username,
		password:req.body.password,
		role:null,
	};

	allUserModel.validate(user,(status)=>{
		if(status)
		{
			req.session.username=user.username;
			req.session.role=user.role;
			console.log("Session created! username"+req.session.username);
			console.log("Role "+req.session.role);
			//res.redirect()
			if(req.session.role=="enduser")
			{
				res.redirect("/home");
			}
			else if(req.session.role=="publisher")
			{
				res.redirect("/publisher/home");
			}
			else if(req.session.role=="admin" || "superadmin")
			{

			}
			else if(req.session.role=="modartor")
			{

			}
			else
			{
				res.send("<h1>Invalid Request</h1>");
			}

		}
	});
});

module.exports = router;
var express 	= require('express');
var enduserModel 	= require.main.require('./models/enduser.js');
var endWalletModel = require.main.require('./models/wallet.js');
var router 		= express.Router();


var err = {
	username:'',
	password:'',
	firstname:'',
	lastname:'',
	email:'',
	phonenumber:'',
	dateofbirth:'',
	allokflag:false
}


function getCurrentDate()
{
	var today = new Date();
	/* var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = yyyy + '-' + mm + '-' + dd; */
	return today;
}

router.get('/', function(req, res)
{
	err.username='';
	err.password='';
	err.firstname='';
	err.lastname='';
	err.email='';
	err.phonenumber='';
	err.dateofbirth='';
	err.allokflag=false;
	res.render('registration',err);
});

router.post('/', function(req, res){

	err.username='';
	err.password='';
	err.firstname='';
	err.lastname='';
	err.email='';
	err.phonenumber='';
	err.dateofbirth='';
	err.allokflag=false;
	
	var user = {
		username:req.body.username,
		role:'',
		password:req.body.password,
		retypepassword:req.body.retypePassword,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		phonenumber:req.body.phonenumber,
		dateofbirth:req.body.dateofbirth,
	};
	console.log("firstname "+user.firstname);
	console.log("lastname "+user.lastname);
	console.log("email "+user.email);
	console.log("Phonenumber "+user.phonenumber)
	console.log("propic "+user.propic);
	console.log("date of birth "+user.dateofbirth);
	console.log("bio "+user.bio);





	enduserModel.validate(user,(status)=>{
		var validateData =true;
		var numbers = /^[0-9]+$/;
		if(status)
		{
			err.username='username exist try another';
			validateData=false;
		}
		if(user.username=="")
		{
			err.username='invalid username format';
			validateData=false;
		}
		if(user.password=="" || user.retypePassword=="") 
		{
			err.password='invalid password';
			validateData=false;
		}
		if(user.password!=user.retypepassword)
		{
			err.password='invalid password';
			validateData=false;
		}
		if(user.firstname=="" )
		{
			validateData=false;
			err.firstname='invalid firstname format';
		}
		if(user.lastname=="")
		{
			validateData=false;
			err.lastname='invalid lastname format';
		}
		if(user.phonenumber=="")
		{
			validateData=false;
			err.phonenumber='invalid phonenumber format';
		}
		var inputDate = new Date(user.dateofbirth);
		if(user.dateofbirth=="" || inputDate>getCurrentDate())
		{
			err.dateofbirth='invalid date format';
		}

		if(!validateData)
		{
			res.render('registration',err);
			console.log(err);
			console.log(user);
		}
		else
		{
			enduserModel.registerToAllUser(user, function(status){
				if(status){
					enduserModel.registerToEnduser(user,function(status){
						if(status)
						{
							err.allokflag=true;
							console.log('this branch executed');

							endWalletModel.createWallet(user.username,function(status){
								res.render('registration',err);
							});


							//res.render('registration',err);
						}
						else
						{
							enduserModel.deleteFromAllUser(user,function(status){
								if(status)
								{
									res.send("problem resolved ");
								}
								else
								{
									res.send("Server down!");
								}
							});
						}
					});
					
				}else{
					res.send('Opps something was wrong !');
				}
			});
		}
	});

});

module.exports = router;
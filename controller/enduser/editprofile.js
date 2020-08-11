var express 	= require('express');
var enduserModel =  require.main.require("./models/enduser.js");
var router 		= express.Router();
const fileUpload = require('express-fileupload');
const { v4 : uuidv4 } = require('uuid');
const e = require('express');
const { reset } = require('nodemon');

router.use(fileUpload());

var propicFound =false;


var err= {

	firstname:'',
	lastname:'',
	email:'',
	phonenumber:'',
	propic:'',
	dateofbirth:'',
	bio:'',
	success:false
};


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
function validateEmail(mail)
{
	console.log("mail number = "+mail);
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(mail.match(mailformat))
		{
			return true;
		}
		else
		{
			return false;
		}
}

function phonenumber(number)
{
  var phoneno = /^\d{10}$/;
	console.log("phone number = "+number);
	if(number.match(phoneno))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function getCurrentDate()
{
	var today = new Date();
	return today;
}



router.get('/', function(req, res){


	err.firstname='';
	err.lastname='';
	err.email='';
	err.phonenumber='';
	err.propic='';
	err.dateofbirth='';
	err.bio='';
	err.success=false;

	if(req.session.username!=null)
	{
		enduserModel.getprofileinfo(req.session.username,(result)=>{
			console.log("Result for getProfileInfo"+result.length);
			if(result.length==1)
			{
				/* console.log("propic path isss  "+result[0].propic); */
				result[0].dateofbirth=formatDate(result[0].dateofbirth);
				//console.log("edit profile date value "+result[0].dateofbirth);
				res.render('enduser/editprofile',{result,err});
			}
			else
			{
				res.send("<h1>Something was wrong !!!</h1>");
			}
		});
	}
	else
	{
		res.redirect('/login');
	}
});

router.post('/', function(req, res){

	/* err.firstname='';
	err.lastname='';
	err.email='';
	err.phonenumber='';
	err.propic='';
	err.dateofbirth='';
	err.bio='';
	err.success=false;

	var validate =true;
	
	var user = {
		username:req.session.username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		phonenumber:req.body.phonenumber,
		propic:req.files,
		dateofbirth:req.body.dateofbirth,
		bio:req.body.bio
	}; */

	
/* 	console.log("firstname "+user.firstname);
	console.log("lastname "+user.lastname);
	console.log("email "+user.email);
	console.log("Phonenumber "+user.phonenumber)
	console.log("propic "+user.propic);
	console.log("date of birth "+user.dateofbirth);
	console.log("bio "+user.bio);

	 */

	/* if(user.firstname=='')
	{
		validate=false;
		err.firstname="firstname can't be empty";
		
	}
	if(user.lastname=='')
	{
		validate=false;
		err.lastname="lastname can't be empty";
	}
	if(user.email=='' || !validateEmail(user.email))
	{
		validate=false;
		err.email="invalid email format";
	}
	if(user.phonenumber=='' || phonenumber(user.phonenumber))
	{
		validate=false;
		err.phonenumber="invalid phonenumber format";
	}

	if(user.propic!=null)
	{
		user.propic=req.files.propic;
		var results= user.propic.name.split(".");
		console.log("1 user propic is "+user.propic);
		if((results[1]=="jpg" || results[1]=="png" || results[1]=="giff" || results[1]=="jpeg")==false)
		{
			validate=false;
			err.propic="Unsupported picture format";	
		}
		else
		{	
			var picname= uuidv4();
			var picpath='res/enduser/propic/'+picname+'.jpg';
		}
	
		
	}
	else
	{
		enduserModel.getprofileinfo(req.session.username,(result)=>{
			/* console.log("Result for getProfileInfo"+result.length);
			console.log("result length "+result.length);
			console.log("result propic is "+result[0].propic); */
			/* if(result.length==1)
			{
				console.log("PROPIC IS FOUND "+result[0].propic);
				user.propic=result[0].propic;
				console.log("PROPIC IS FOUND "+user.propic);
				propicFound=false;
			}
			else
			{
				console.log("I am here");
				res.send("<h1>Something was wrong !!!</h1>");
			}
		});
	}
	var inputDate = new Date(user.dateofbirth);
	if(user.dateofbirth=="" || inputDate>getCurrentDate())
	{
		validate=false;
		err.dateofbirth='invalid date format';
	}
	
	if(validate)
	{
		
		if(propicFound)
		{
			user.propic.mv(picpath, function(err) {
				if(err)
				{
					console.log("server crashed for picpath");
					res.send("<h1>Server Crashed</h1>");
				}
			});
			user.propic=picpath;
		}
		console.log("PROPICCCCCC PATHHH IS "+user.picpath);
		enduserModel.updateUserinfo(user,(status)=>{
			if(status)
			{
				err.success=true;
			}
			enduserModel.getprofileinfo(user.username,(result)=>{
				if(result.length>0)
				{
					result[0].propic=user.propic;
					res.render("enduser/editprofile",{result,err});
				}	
				else
				{
					res.send("<h1>Server Creashed </h1>");
				}
			});
		});
	} */
	/* if(user.propic!=null)
	{
		var picname= uuidv4();
		var picpath='res/enduser/propic/'+picname+'.jpg';
		user.propic.mv(picpath, function(err) {
			if(err)
			{
				console.log("server crashed for picpath");
				res.send("<h1>Server Crashed</h1>");
			}
		});
		user.propic=picpath;

		err.success=true;
		enduserModel.updateUserinfo(user,(status)=>{
			if(status)
			{
				err.success=true;
			}
			
		});
	} */

	/* enduserModel.getprofileinfo(req.session.username,(result)=>{
		console.log("Result for getProfileInfo"+result.length);
		if(result.length==1)
		{
			console.log("In easdasdasdas");
			result[0].dateofbirth=formatDate(result[0].dateofbirth);
			console.log("edit profile date value "+result[0].dateofbirth);
			res.render('enduser/editprofile',{result,err});
		}
		else
		{
			res.send("<h1>Something was wrong !!!</h1>");
		}
	}); */ 

	

	err.firstname='';
	err.lastname='';
	err.email='';
	err.phonenumber='';
	err.propic='';
	err.dateofbirth='';
	err.bio='';
	err.success=false;

	var copyPicture=false;
	var validate =true;
	var user = {
		username:req.session.username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		phonenumber:req.body.phonenumber,
		propic:req.files,
		dateofbirth:req.body.dateofbirth,
		bio:req.body.bio
	};
	//bind current propicture
	
	console.log("Propic is "+user.propic);

	if(user.firstname=='')
	{
		validate=false;
		err.firstname="firstname can't be empty";
		
	}
	if(user.lastname=='')
	{
		validate=false;
		err.lastname="lastname can't be empty";
	}
	if(user.email=='' || !validateEmail(user.email))
	{
		validate=false;
		err.email="invalid email format";
	}
	if(user.phonenumber=='' || phonenumber(user.phonenumber))
	{
		validate=false;
		err.phonenumber="invalid phonenumber format";
	}
	if(user.propic!=null)
	{
		console.log("before "+user.propic);
		user.propic=req.files.propic;
		console.log("after "+user.propic);
		var extension= user.propic.name.split(".");
		if((extension[1]=="jpg" || extension[1]=="png" || extension[1]=="giff" || extension[1]=="jpeg")==false)
		{
		
			validate=false;
			err.propic="Unsupported picture format";	
		}
		else
		{	
			var picname= uuidv4();
			var picpath='res/enduser/propic/'+picname+'.jpg';
			copyPicture=true;
		}
	}
	else
	{
		copyPicture=false;
	}

	var inputDate = new Date(user.dateofbirth);
	if(user.dateofbirth=="" || inputDate>getCurrentDate())
	{
		validate=false;
		err.dateofbirth='invalid date format';
	}

	if(validate && copyPicture)
	{
		err.success=true;
		//copy pic path
		user.propic.mv(picpath, function(error) {
			if(error)
			{
				console.log("server crashed for picpath");
				res.send("<h1>Server Crashed</h1>");
			}
		});

		user.propic=picpath;
		// update to db 

		enduserModel.updateUserinfo(user,(status)=>{
			
			if(status)
			{
				console.log("Account updated Successfully");
			}
			else
			{
				res.send("<h1>Database Server Error</h1>");
			}

		});

	}
	
	var result= new Array(user);
	res.render('enduser/editprofile',{result,err});

});

module.exports = router;
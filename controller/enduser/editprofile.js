var express 	= require('express');
var enduserModel =  require.main.require("./models/enduser.js");
var router 		= express.Router();
//const fileUpload = require('express-fileupload');
const { v4 : uuidv4 } = require('uuid');
/* const e = require('express');
const { reset } = require('nodemon');
const enduser = require('../../models/enduser'); */

//router.use(fileUpload());


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


var propicpath="---";
function bindPropic(propic)
{
	console.log("inside bindPropic "+propic);
	propicpath=propic;
	console.log("inside bindPropic "+propicpath);
}


function getPropicValue(username)
{
	enduserModel.getprofileinfo(username,(result)=>{
		if(result.length>0)
		{
			//console.log("inside bindPropic "+result[0].propic);
			bindPropic(result[0].propic);
		}
	});

}

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

	if(req.cookies['user']!=null)
	{
		enduserModel.getprofileinfo(req.cookies['user'].username,(result)=>{
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

	console.log("Req fiels "+req.files);
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
		username:req.cookies['user'].username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		phonenumber:req.body.phonenumber,
		propic:req.files,
		dateofbirth:req.body.dateofbirth,
		bio:req.body.bio
	};
	//bind current propicture
	
	console.log("Propic is ",{user});
	/* var p;
	getProPath((path)=>{

	}); */

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
	if(user.phonenumber=='')
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
			//getPropicValue(user.username);
			//user.propic=req.files.propic;
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
		//getPropicValue(user.username);
		//user.propic=req.files.propic;
		
	}

	var inputDate = new Date(user.dateofbirth);
	if(user.dateofbirth=="" || inputDate>getCurrentDate())
	{
		validate=false;
		err.dateofbirth='invalid date format';
	}

	if(validate)
	{
		err.success=true;
		//copy pic path
		if(copyPicture)
		{
			user.propic.mv(picpath, function(error) {
				if(error)
				{
					console.log("server crashed for picpath");
					res.send("<h1>Server Crashed</h1>");
				}
			});
			user.propic=picpath;
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
		
	}
	//var result= new Array(user);
	var result= new Array(user);
		res.render("enduser/editprofile",{result,err});

});

module.exports = router;
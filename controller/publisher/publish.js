var express 	= require('express');
const gamelist = require('../../models/gamelist');
const fileUpload = require('express-fileupload');
var router 		= express(); // not using express.Router() because of file upload module
var gamelistModule = require.main.require('./models/gamelist.js');
const { v4 : uuidv4 } = require('uuid');
//const e = require('express');

var err = {
	gametitle:'',
	publisher:'',
	publishdate:'',
	price:'',
	gamelocation:'',
	gamepicture:'',
	parentgameid:'',
	success:false
};
function getCurrentDate()
{
	var today = new Date();
	return today;
}


router.use(fileUpload());

router.get('/', function(req, res){

	err.success=false;
	err.gametitle='';
	err.publisher='';
	err.publishdate='';
	err.price='';
	err.gamelocation='';
	err.gamepicture='';
	err.parentgameid='';

	if(req.cookies['user']!=null)
	{
		res.render('publisher/publish',err);
	}
	else
	{
		res.redirect('/login');
	}

});
router.post('/',function(req,res){

	var validate=true;

	err.gametitle='';
	err.publisher='';
	err.publishdate='';
	err.price='';
	err.gamelocation='';
	err.gamepicture='';
	err.parentgameid='';

	 var user= {
		gametitle:req.body.gametitle,
		publisher:req.cookies['user'].username,
		publishdate:req.body.publishdate,
		price:req.body.price,
		gamepicture:req.files,
		gamelocation:req.files,
		parentgameid:req.body.parentgameid
	}
	console.log("logging "+user.gamepicture);

	if(user.gametitle=='')
	{
		err.gametitle="invalid game title";
		validate=false;
	}
	if(user.price<0 || user.price=='')
	{
		err.price="price can't be negative or empty";
		validate=false;
	}

	var inputDate = new Date(user.publishdate);
	if(user.publishdate=="" || inputDate<getCurrentDate())
	{
	
		err.publishdate='invalid date format';
		validate=false;
	}


	if(user.gamepicture!==null)
	{
		user.gamepicture=req.files.gamepicture;
		
		var result= user.gamepicture.name.split(".");
		
		if((result[1]=="jpg" || result[1]=="png" || result[1]=="giff" || result[1]=="jpeg")==false)
		{
			validate=false;
			err.gamepicture="Incorrect file format";	
		}
	}
	else
	{
		validate=false;
		err.gamepicture="No files were selected ";
	}


	if(user.gamelocation!==null)
	{
		user.gamelocation=req.files.gamelocation;
		var result= user.gamelocation.name.split(".");
	
		if(result[1]=="jpg" || result[1]=="png" || result[1]=="giff" || result[1]=="jpeg")
		{
			validate=false;
			err.gamelocation="Images can't be treated as game files !";
		}
	}
	else
	{
		validate=false;
		err.gamelocation="No files were selected";
	}
	
	if(!validate)
	{
		res.render("publisher/publish",err);
	}
	else
	{
		var filename= uuidv4();
		var picpath='res/gameimages/'+filename+'.jpg';
		user.gamepicture.mv(picpath, function(err) {
			if(err)
			{
				console.log("server crashed for picpath");
				res.send("<h1>Server Crashed</h1>");
			}
		});
		var filepath='res/gamelocation/'+filename+'.game';
		user.gamelocation.mv(filepath, function(err) {
			if(err)
			{
				console.log("server crashed for filepath");
				res.send("<h1>Server Crashed</h1>");
			}
		});
		user.gamelocation=filepath;
		user.gamepicture=picpath;

		gamelistModule.publish(user,(status)=>{
 
			if(status)
			{
				err.success=true;
			}
			res.render("publisher/publish",err)	

		});
	}

});


module.exports = router;
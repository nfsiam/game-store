var express 	= require('express');
var router 		= express.Router();
var modelEnduser =  require.main.require("./models/enduser.js");

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



var err= {



};





router.get('/', function(req, res){

	if(req.session.username!=null)
	{
		modelEnduser.getprofileinfo(req.session.username,(result)=>{
			console.log("Result for getProfileInfo"+result.length);
			if(result.length==1)
			{
				result[0].dateofbirth=formatDate(result[0].dateofbirth);
				console.log("edit profile date value "+result[0].dateofbirth);
				res.render('enduser/editprofile',{result});
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

   


});

module.exports = router;
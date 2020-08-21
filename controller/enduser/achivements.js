var express 	= require('express');
var router 		= express.Router();


router.get('/', function(req, res){

	
	/* if(req.session.username!=null)
	{
		res.render('enduser/achivements');
	}
	else
	{
		res.redirect('/login');
	} */

	if (req.cookies['user'] != null) {

		res.render('enduser/achivements');
	} 
	else 
	{
        res.redirect('/login');
    }

});

module.exports = router;
var express 	= require('express');
var router 		= express.Router();
var notificationModel = require.main.require("./models/notification");

router.get('/', function(req, res){

	if(req.session.username!=null)
	{
        notificationModel.getNotification(req.session.username,(result)=>{
            if(result.length>0)
            {
                res.send(result);
            }
            else
            {
                res.send("You have no notifications");
            }
        });
		
    }
    else
    {
        res.redirect('/login');   
    }

});

module.exports = router;
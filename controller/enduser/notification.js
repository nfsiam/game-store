var express 	= require('express');
var router 		= express.Router();
var notificationModel = require.main.require("./models/notification");

router.get('/', function(req, res){

	if(req.cookies['user']!=null)
	{
        notificationModel.getNotification(req.cookies['user'].username,(result)=>{
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
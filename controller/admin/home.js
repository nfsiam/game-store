var express 	= require('express');
var router 		= express.Router();
var rechargerequestModel = require.main.require("./models/rechargerequest.js");
var notificationModel = require.main.require("./models/notification.js");

router.get('/', function(req, res){

	if(req.session.username!=null)
	{
        rechargerequestModel.getAllRequest(req.session.username,(result)=>{
       
            
            res.render("admin/index",{result});
        });
        
	}
	else
	{
		res.redirect('/login');
	}

});
router.get('/approve/:id', function(req, res){

	
	if(req.session.username!=null)
	{
        rechargerequestModel.updateRequest(req.session.username,req.params.id,'approved',(status)=>{
                if(status)
                {
                    rechargerequestModel.getAllRequest(req.session.username,(result)=>{ 
                        notificationModel.sendRechareNotification(result[0].username,'approved',result[0].id,(status)=>{
                            if(status)
                            {
                                res.redirect("/admin/home");
                            }
                            else
                            {
                                res.send("<h1>Something was wrong134 </h1>");
                            }
                        });
                    });
                }
                else
                {
                    res.send("<h1>Something was wrongasddd </h1>");
                }
        });
	}
	else
	{
		res.redirect('/login');
	}

});
router.get('/reject/:id', function(req, res){

	
	if(req.session.username!=null)
	{
       
        rechargerequestModel.updateRequest(req.session.username,req.params.id,'rejected',(status)=>{
                if(status)
                {
                    rechargerequestModel.getAllRequest(req.session.username,(result)=>{ 
                        notificationModel.sendRechareNotification(result[0].username,'rejected',result[0].id,(status)=>{
                            if(status)
                            {
                                res.redirect("/admin/home");
                            }
                            else
                            {
                                res.send("<h1>Something was wrong </h1>");
                            }
                        });
                    });
                }
                else
                {
                    res.send("<h1>Something was wrong </h1>");
                }
        });
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
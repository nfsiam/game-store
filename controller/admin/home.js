var express 	= require('express');
var router 		= express.Router();
var rechargerequestModel = require.main.require("./models/rechargerequest.js");
var notificationModel = require.main.require("./models/notification.js");
var walletModel = require.main.require("./models/wallet.js");

router.get('/', function(req, res){

	if(req.cookies['user'].username!=null)
	{
        rechargerequestModel.getAllRequest(req.cookies['user'].username,(result)=>{
       
            
            res.render("admin/index",{result});
        });
        
	}
	else
	{
		res.redirect('/login');
	}

});
router.get('/approve/:id', function(req, res){

	if(req.cookies['user'].username!=null)
	{
        rechargerequestModel.updateRequest(req.cookies['user'].username,req.params.id,'approved',(status)=>{
                if(status)
                {
                    rechargerequestModel.getAllRequestById(req.cookies['user'].username,req.params.id,(result)=>{ 
                        notificationModel.sendRechareNotification(result[0].username,'approved',req.params.id,(status)=>{
                            walletModel.updateBalance(result[0].username,result[0].amount,(status)=>{
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

	
	if(req.cookies['user'].username!=null)
	{
       
        rechargerequestModel.updateRequest(req.cookies['user'].username,req.params.id,'rejected',(status)=>{
                if(status)
                {
                    rechargerequestModel.getAllRequest(req.cookies['user'].username,(result)=>{ 
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
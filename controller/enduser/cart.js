var express 	= require('express');
const e = require('express');
var router 		= express.Router();
var cartModel =  require.main.require("./models/cart.js");
var transactionModel =require.main.require("./models/transaction.js");
var libraryModel =require.main.require("./models/library.js");
var walletModel = require.main.require("./models/wallet.js");

router.get('/getitems', function(req, res){
	
	if(req.session.username!=null)
	{
        cartModel.getItems(req.session.username,(result)=>{
            res.send(result);
        });
	}
	else
	{
		res.redirect('/login');
	}
});

router.get('/removeitems', function(req, res){
	
	if(req.session.username!=null)
	{
        cartModel.removeItems(req.session.username,(status)=>{
            res.send(status);
        });
	}
	else
	{
		res.redirect('/login');
	}

});

router.get('/checkout', function(req, res){
	var infos ={
		gameid:'',
		price:'',
		amount:'',
		totalcheckout:0
	};
	if(req.session.username!=null)
	{
		cartModel.getItems(req.session.username,(result)=>{
			console.log("cart result length is "+result.length);
			if(result.length>0)
			{
				for(var i=0;i<result.length;i++)
				{
					infos.totalcheckout+=result[i].price;
				}
				walletModel.getCurrentBalance(req.session.username,(walletResult)=>{
					if(walletResult.length==1)
					{
						if(infos.totalcheckout<=walletResult[0].amount)
						{
							for(var i=0;i<result.length;i++)
							{
								console.log("inside for loop ", result[i]);
								infos.price=result[i].price;
								//infos.totalcheckout+=result[i].price;
								console.log("Checkout price "+infos.totalcheckout);
								console.log("infos price izzz"+infos.price);
								transactionModel.insertTransanction(req.session.username,infos.gameid,infos.price,(status)=>{
									//console
									console.log("inside transanction !");
									if(status)
									{
										libraryModel.insertLibrary(req.session.username,infos.gameid,(status)=>{
											if(status)
											{
												walletModel.getCurrentBalance(req.session.username,(walletResult)=>{
													if(walletResult.length==1)
													{
														infos.amount=walletResult[0].amount;
														console.log("infos amount is "+infos.amount);
														console.log("infos price should be"+infos.price);
														var balance = infos.amount-infos.totalcheckout;
														console.log("Balance after purchase should be "+balance);
														walletModel.updateBalanceAfterPurchase(req.session.username,balance,(status)=>{
															if(!status)
															{
																res.send("<script>alert('Error Updating wallet')</script>");
																
															}
														});
													}
													else
													{
														res.send("<script>alert('Error fetching wallet')</script>");
													}
												});
											}
											else
											{
												res.send("<script>alert('Error Adding Game to Library')</script>");
											}
										});
									}
									else
									{
										res.send("<script>alert('Error In Transaction')</script>");
									}
								}); 
							}
						}
						else
						{
							res.send("<script>alert('Not Enough balance in wallet')</script>");
						}
					}
					else
					{
						res.send("<script>alert('Error fetching wallet')</script>");
					}

				});
				
			}
			else
			{
				res.send("<script>alert('No Games in cart!')</script>");
			}
			cartModel.removeItems(req.session.username,(status)=>{
				 if(status){
					res.send("<script>Operation Successful</script>");

				}
				else
				{
					res.send("<script>alert('Error Removing cart items')</script>");
				} 

			});
			

		});
		
	}
	else
	{
		res.redirect('/login');
	}

});

module.exports = router;
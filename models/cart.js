var db = require('./db');
const e = require('express');


module.exports = 
{
   
      getItems:(username,callback)=>{
        var sql ="select cart.cartid,cart.gameid,cart.username,gamelist.gametitle,gamelist.price from cart inner join gamelist on cart.gameid=gamelist.gameid where username = '"+username+"'";
        console.log(sql);
        db.getResults(sql,null,(result)=>{
            
            if(result.length>0)
            {
              callback(result);
            }
            else
            {
              callback([]);
            }
          });
      },
      getCartItemById:(username,id,callback)=>{
          var sql = "select * from cart where username='"+username+"' and gameid='"+id+"' ";
          db.getResults(sql,null,(result)=>{
            if(result.length>0)
            {
              callback(result);
            }
            else
            {
              callback([]);
            }
          });
      },
      removeItems:(username,callback)=>{
        var sql="delete from cart where username= '"+username+"' ";
        db.execute(sql,null,(status)=>{
          if(status)
          {
            callback(true);
          }
          else
          {
            callback(false);
          }

        });

      },


     /*  checkout:(username,callback)=>{
        var sql = "select * from cart where username='"+username+"' ";  // retrive all games inside cart
        console.log(sql);
          db.getResults(sql,(result)=>{
            if(result.length>0)
            {
                for(var i=0;i<result.length;i++)
                {
                  console.log("Game id "+result[i].gameid);
                  var getPriceOfGame = "select * from gamelist where gameid= '"+result[i].gameid+"' ";
                  console.log(getPriceOfGame);
                  db.getResults(getPriceOfGame,(priceResult)=>{
                     
                      if(priceResult.length>0)
                      {
                        
                          var insertTransanction = "insert into transaction values('','"+result[i].gameid+"','"+username+"','"+priceResult[0].price+"')";
                          console.log(insertTransanction);
                          
                          db.execute(insertTransanction,(transactionStatus)=>{

                            if(transactionStatus)
                            {
                              var insertIntoLibrary = "insert into library values ('','"+result[i].gameid+"','"+username+"','-1','n/a') ";
                              console.log(insertIntoLibrary);
                              db.execute(insertIntoLibrary,(libraryStatus)=>{

                                  var getWalletBalance="select * from wallet where usename='"+username+"'";
                                  console.log(getWalletBalance);
                                  db.getResults(getWalletBalance,(walletResult)=>{
                                    if(walletResult.length==1)
                                    {
                                        var remainingBalance = walletResult[0].amount;
                                        remainingBalance=remainingBalance-priceResult[0].price;
                                        var updateBalance = "update wallet set amount='"+remainingBalance+"' where username='"+username+"' ";
                                        console.log(updateBalance);
                                        db.execute(updateBalance,(status)=>{
                                          if(status)
                                          {
                                              console.log('success');
                                          }
                                          else
                                          {
                                              console.log("wallet update failed");
                                          }

                                        });
                                    }
                                    else
                                    {
                                      console.log("getting wallet ballance failed");
                                    }
                                  });

                              });
                            }
                            else
                            {
                                console.log("inserting into library failed !");
                            }
                          });
                      }
                      else
                      {
                          console.log("Getting games from gamelist failed !");
                      }
                  });
                  
                }
                callback(true);
            }
            else
            {
                console.log("Getting items from cart failed !");
            }
            var removefromCart="delete from cart where username= '"+username+"' ";
            db.execute(removefromCart,(status)=>{
             if(status)
             {
               console.log("removed all items from cart after purchase !");
             }
             else
             {
               console.log("cart removation vailed !");
             }
    
            });
          });  

      },
 */
}
var db = require('./db');
const { getResults } = require('./db');

module.exports = 
{
   
      getItems:(username,callback)=>{
        var sql ="select cart.cartid,cart.gameid,cart.username,gamelist.gametitle,gamelist.price from cart inner join gamelist on cart.gameid=gamelist.gameid where username = '"+username+"'";
        db.getResults(sql,(result)=>{
            callback(result);
          });

      },

}
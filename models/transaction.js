var db = require('./db');


module.exports ={
    
    insertTransanction:(username,gameid,price,callback)=>{
        var sql="insert into transaction values('','"+gameid+"','"+username+"','"+price+"')";
        db.execute(sql,(status)=>{

            callback(status);
        })
    },
}
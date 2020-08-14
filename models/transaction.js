var db = require('./db');


module.exports ={
    
    insertTransanction:(username,gameid,price,callback)=>{
        var sql="insert into transaction values('','"+gameid+"','"+username+"','"+price+"')";
        db.execute(sql,(status)=>{

            callback(status);
        })
    },
    getAllTransaction:(username,callback)=>{
        var sql="select * from transaction where username='"+username+"'";
        db.getResults(sql,(result)=>{
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
}
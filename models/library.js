var db = require('./db');


module.exports ={
    
    insertLibrary:(username,gameid,callback)=>{

        var sql="insert into library values ('','"+gameid+"','"+username+"','-1','n/a') ";
        db.execute(sql,(status)=>{

            callback(status);
        })
    },
}
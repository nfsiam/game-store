var db = require('./db');


module.exports ={
    
    insertLibrary:(username,gameid,callback)=>{

        var sql="insert into library values ('','"+gameid+"','"+username+"','-1','n/a') ";
        db.execute(sql,(status)=>{

            callback(status);
        })
    },
    getAllByUser:(username,callback)=>{
        var sql="select gamelist.gameid, gamelist.gametitle,gamelist.publisher,gamelist.publishdate,gamelist.price,gamelist.gamelocation,gamelist.gamepicture , transaction.gameid,transaction.username from gamelist INNER join transaction on gamelist.gameid=transaction.gameid where transaction.username='"+username+"'";
        console.log(sql);
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
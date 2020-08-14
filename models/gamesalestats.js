var db = require('./db');
const e = require('express');

module.exports =
{
    getAll:(user,callback)=>{
        var sql="select * from gamesalestats where publishername='"+user+"' ";
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
	insert: (user,id,gameprice,gamename, callback)=>{
        var sql= "insert into gamesalestats values ('"+user+"','"+id+"','"+gamename+"','"+gameprice+"','0')";
        console.log(sql);
        db.execute(sql,(status)=>{
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

    update:(id,total,callback)=>{
        var sql = "update gamesalestats set totalsold='"+total+"' where gameid='"+id+"' ";
        console.log(sql);
        db.execute(sql,(status)=>{
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
}
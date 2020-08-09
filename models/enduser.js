var db = require('./db');


module.exports =
{
    validate: (user, callback)=>{

		var sql = "select * from alluser where username='"+user.username+"'";
		console.log(sql);
		db.getResults(sql, (result)=>{
			//console.log(result[0]);
			if(result.length > 0)
			{
				user.role=result[0].role;
				callback(true);
			}
			else{
				callback(false);
			}
		});
    },
    
    registerToAllUser: function(user, callback){
		var sql = "insert into alluser values('"+user.username+"', '"+user.password+"', 'enduser')";
		console.log(sql);
		db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
    },
    registerToEnduser:function(user,callback)
    {
        sql="insert into enduser values ('"+user.username+"','"+user.firstname+"','"+user.lastname+"' ,'"+user.email+"','"+user.phonenumber+"','n/a','"+user.dateofbirth+"','n/a' )";
        db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
    },
    deleteFromAllUser:function(user,callback)
    {
        sql="delete from alluser where username = '"+user.username+"' ";
        db.execute(sql, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
    },

}
var db = require('./db');


module.exports =
{
    validate: (user, callback)=>{

		var sql = "select * from alluser where username='"+user.username+"'";
		console.log(sql);
		db.getResults(sql,null, (result)=>{
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
	getAllUser:(user,callback)=>{
		var sql= "select * from enduser where username!='"+user+"' ";
		console.log(sql);
		db.getResults(sql, null,(result)=>{
			//console.log(result[0]);
			if(result.length>0)
			{
				//user.role=result[0].role;
				callback(result);
			}
			else{
				callback([]);
			}
		});
	},
	getprofileinfo: (user, callback)=>{

		var sql = "select * from enduser where username='"+user+"'";
		console.log(sql);
		db.getResults(sql,null, (result)=>{
			//console.log(result[0]);
			if(result.length == 1)
			{
				//user.role=result[0].role;
				callback(result);
			}
			else{
				callback([]);
			}
		});
	},
	updateUserinfoWithoutPropic:(user,callback)=>
	{
		var sql = "update enduser set firstname = '"+user.firstname+"' , lastname='"+user.lastname+"' , email= '"+user.email+"', phonenumber = '"+user.phonenumber+"',dateofbirth = '"+user.dateofbirth+"',bio='"+user.bio+"' where username='"+user.username+"' ";
		console.log(sql);
		db.execute(sql,null, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
	},
	updateUserinfo:(user,callback)=>
	{
		var sql = "update enduser set firstname = '"+user.firstname+"' , lastname='"+user.lastname+"' , email= '"+user.email+"', phonenumber = '"+user.phonenumber+"', propic = '"+user.propic+"',dateofbirth = '"+user.dateofbirth+"',bio='"+user.bio+"' where username='"+user.username+"' ";
		console.log(sql);
		db.execute(sql,null, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
	},

	updatePassword: (user,callback)=>
	{
		var sql = "update alluser set password '"+user.password+"' where username='"+user.username+"' ";
		console.log(sql);
		db.execute(sql,null, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
	},
    registerToAllUser: function(user, callback){
		var sql = "insert into alluser values('"+user.username+"', '"+user.password+"', 'enduser')";
		console.log(sql);
		db.execute(sql,null, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
    },
    registerToEnduser:function(user,callback)
    {
        sql="insert into enduser values ('"+user.username+"','"+user.firstname+"','"+user.lastname+"' ,'"+user.email+"','"+user.phonenumber+"','res/newuser/nopropic.jpg','"+user.dateofbirth+"','n/a' )";
        db.execute(sql,null, function(status){
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
        db.execute(sql,null, function(status){
			if(status){
				callback(true);
			}else{
				callback(false);
			}
        });
    },

}
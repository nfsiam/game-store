var db = require('./db');

module.exports =
{
	validate: (user, callback)=>{

		var sql = "select * from alluser where username='"+user.username+"' and password='"+user.password+"'";
	
		console.log(sql);
		db.getResults(sql,null, (result)=>{
			//console.log(result[0]);
			if(result.length > 0)
			{
				user.role=result[0].role;
				/* console.log('all',user); */
				callback(true);
			}
			else{
				callback(false);
			}
		});
	},
}
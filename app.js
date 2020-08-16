var express 	= require('express');
var exSession 	= require('express-session');
var bodyParser 	= require('body-parser');
var login 		= require('./controller/login');
var home 		= require('./controller/home');
var app 		= express();

app.set('view engine', 'ejs');

app.use('/login', login);
app.use('/home', home);

app.get('/', function(req, res){
	res.send("this is index page!");
});

app.listen(3000, function(){
	console.log('express http server started at...3000');
});
global.msgQueue = [];
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app);

//socket chat server
require('./server')(server);

const login = require('./controllers/login');
const logout = require('./controllers/logout');
const forum = require('./controllers/forum/forum');
const create = require('./controllers/forum/create');
const gossiproom = require('./controllers/forum/gossiproom');
const moderate = require('./controllers/forum/moderate');

//config
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('./node_modules/@fortawesome/fontawesome-free/'));
app.use(express.static('./node_modules/bootstrap/dist/js/'));
app.use(express.static('./node_modules/bootstrap/dist/css/'));
app.use(express.static('./node_modules/jquery/dist/'));
app.use(express.static('./node_modules/popper.js/dist/umd/'));
app.use(express.static('./node_modules/moment/min'));



//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', login);
app.use('/logout', logout);
app.use('/forum', forum);
app.use('/forum/create', create);
app.use('/forum/gossiproom', gossiproom);
app.use('/forum/moderate', moderate);


server.listen(3000, () => {
    console.log('Server running at 3000');
});
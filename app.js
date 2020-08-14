const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const login = require('./controllers/login');
const logout = require('./controllers/logout');
const forum = require('./controllers/forum/forum');
const issues = require('./controllers/forum/issues');
const reviews = require('./controllers/forum/reviews');
const walkthroughs = require('./controllers/forum/walkthroughs');
const create = require('./controllers/forum/create');

//config
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('./node_modules/@fortawesome/fontawesome-free/'));
app.use(express.static('./node_modules/bootstrap/dist/js/'));
app.use(express.static('./node_modules/bootstrap/dist/css/'));
app.use(express.static('./node_modules/jquery/dist/'));
app.use(express.static('./node_modules/popper.js/dist/umd/'));


//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/login', login);
app.use('/logout', logout);
app.use('/forum', forum);
app.use('/forum/issues', issues);
app.use('/forum/reviews', reviews);
app.use('/forum/walkthroughs', walkthroughs);
app.use('/forum/create', create);


app.listen(3000, () => {
    console.log('Server running at 3000');
});
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

//config
app.set('view engine', 'ejs');

app.use(express.static('public'));

//middleware
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(3000, () => {
    console.log('Server running at 3000');
});
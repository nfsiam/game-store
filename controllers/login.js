const express = require('express');
const alluser = require('../models/alluser');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', { errormessage: '' });
});

router.post('/', function (req, res) {

    const user = {
        username: req.body.username,
        password: req.body.password
    };

    alluser.validate(user, (type) => {
        console.log(type);
        if (!type) {
            res.send('invalid username/password');
        } else if (type == 'user') {
            res.cookie('user', user.username);
            res.redirect('/forum')
        } else if (type == 'moderator') {
            res.cookie('user', user.username);
            res.redirect('/forum')
        }
    });

});

module.exports = router;
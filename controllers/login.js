const express = require('express');
const alluser = require('../models/alluser');
const router = express.Router();


router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        next();
    } else {
        res.redirect('/forum');
    }
});

router.get('/', (req, res) => {
    res.render('login', { errormessage: '' });
});

router.post('/', function (req, res) {

    const user = {
        username: req.body.username,
        password: req.body.password
    };

    alluser.validate(user, (type) => {
        // console.log(type);
        if (!type) {
            res.send('invalid username/password');
        } else {
            res.cookie('user', {
                username: user.username,
                role: type
            });
            res.redirect('/forum')
        }
    });

});

module.exports = router;
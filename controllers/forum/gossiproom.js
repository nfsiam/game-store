const express = require('express');
const moment = require('moment');
const forumModel = require.main.require('./models/forum/forumModel');
const router = express.Router();

router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        next();
    }
});

router.get('/', function (req, res) {
    res.render('forum/gossiproom', {
        username: req.cookies['user'].username
    });
});



module.exports = router;
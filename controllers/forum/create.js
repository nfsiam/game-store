const express = require('express');
const moment = require('moment');
const createModel = require.main.require('./models/forum/createModel');
const router = express.Router();


router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        if (req.cookies['user'].role != 'moderator' && req.cookies['user'].role != 'admin') {
            next();
        } else {
            res.redirect('/forum');
        }
        // console.log(req.cookies['user']);
    }
});

router.get('/', function (req, res) {
    createModel.getOwnedGames(req.cookies['user'].username, (gamelist) => {
        // console.log(gamelist);
        res.render('forum/create', { gamelist });
    });
});

router.post('/', function (req, res) {
    req.body["username"] = req.cookies['user'].username;
    // console.log(req.body);

    createModel.createPost(req.body, (status) => {
        if (status) {
            res.redirect(`/forum/${req.body.posttype}s`);
        }
        else {
            res.redirect('/forum/create');
        }
    });
});




module.exports = router;
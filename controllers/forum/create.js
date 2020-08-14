const express = require('express');
const moment = require('moment');
const forumposts = require.main.require('./models/forum/forumposts');
const router = express.Router();

router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        next();
    }
});

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
    res.render('forum/create');
});
router.get('/:id', function (req, res) {
    const postid = req.params.id;
    forumposts.getPost(postid, 'issue', (postAndComments) => {
        if (!postAndComments) {
            res.send('can not get post');
        } else {
            res.render('forum/post', postAndComments);
        }
    });
});



module.exports = router;
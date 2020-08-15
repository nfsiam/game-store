const express = require('express');
const moment = require('moment');
// const moderateModel = require.main.require('./models/forum/moderateModel');
const forumposts = require.main.require('./models/forum/forumposts');
const router = express.Router();

router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        // console.log(req.cookies['user']);
        next();
    }
});

router.get('/', function (req, res) {
    res.render('forum/moderate');
});

router.get('/pending', function (req, res) {
    forumposts.getPendingPosts((pendingPostList) => {
        console.log(pendingPostList);
        res.render('forum/pending', { pendingPostList });
    })
});


router.get('/pending/:postid', function (req, res) {
    const postid = req.params.postid;
    console.log(postid);
    forumposts.getPendingPost(postid, 'issue', (data) => {
        if (!data) {
            res.send('can not get post');
        } else {
            data["role"] = req.cookies['user'].role;
            data["pending"] = 'yes';
            res.render('forum/post', data);
        }
    });
});

router.post('/pending/:postid', function (req, res) {
    const postid = req.params.postid;
    const decision = req.body.decision;
    console.log(decision);

    forumposts.changeStatus(postid, decision, (status) => {
        if (status) {
            res.redirect('/forum/moderate/pending');
        } else {
            res.redirect('/forum/moderate/pending/' + postid);
        }
    });
});


module.exports = router;
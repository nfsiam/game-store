const express = require('express');
const moment = require('moment');
const forumModel = require.main.require('./models/forum/forumModel');
const postFormatter = require('./postFormatter');
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
    forumModel.getLandingPosts((landingPosts) => {
        for (let i = 0; i < landingPosts.length; i++) {
            for (let j = 0; j < landingPosts[i].length; j++) {
                const element = landingPosts[i][j];
                const t = landingPosts[i][j]['time'];
                landingPosts[i][j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");

            }
        }
        res.render('forum/forum', {
            role: req.cookies['user'].role,
            issues: landingPosts[0],
            reviews: landingPosts[1],
            walkthroughs: landingPosts[2]
        });
    });
});


//issues
router.get('/issues', function (req, res) {
    const user = req.cookies['user'];
    postFormatter.getAllPost({ type: 'issue', user }, (data) => {
        res.render('forum/posts', data);
    });
});

router.get('/issues/:id', function (req, res) {
    const postid = req.params.id;
    const user = req.cookies['user'];
    postFormatter.getPost({ postid, user, type: 'issue' }, (data) => {
        if (!data) {
            res.send('something went wrong');
        } else {
            res.render('forum/post', data);
        }
    });
});

//reviews
router.get('/reviews', function (req, res) {
    const user = req.cookies['user'];
    postFormatter.getAllPost({ type: 'review', user }, (data) => {
        res.render('forum/posts', data);
    });
});

router.get('/reviews/:id', function (req, res) {
    const postid = req.params.id;
    const user = req.cookies['user'];
    postFormatter.getPost({ postid, user, type: 'review' }, (data) => {
        console.log('here');
        if (!data) {
            res.send('something went wrong');
        } else {
            res.render('forum/post', data);
        }
    });
});

//walkthroughs
router.get('/walkthroughs', function (req, res) {
    const user = req.cookies['user'];
    postFormatter.getAllPost({ type: 'walkthrough', user }, (data) => {
        res.render('forum/posts', data);
    });
});

router.get('/walkthroughs/:id', function (req, res) {
    const postid = req.params.id;
    const user = req.cookies['user'];
    postFormatter.getPost({ postid, user, type: 'walkthrough' }, (data) => {
        if (!data) {
            res.send('something went wrong');
        } else {
            res.render('forum/post', data);
        }
    });
});





module.exports = router;
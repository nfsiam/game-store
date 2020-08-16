const express = require('express');
const moment = require('moment');
const moderateModel = require.main.require('./models/forum/moderateModel');
const postFormatter = require('./postFormatter');

const forumposts = require.main.require('./models/forum/forumposts');
const router = express.Router();


router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        if (req.cookies['user'].role == 'moderator' || req.cookies['user'].role == 'admin') {
            next();
        } else {
            res.redirect('/forum');
        }
        // console.log(req.cookies['user']);
    }
});


//moderate landing page
router.get('/', function (req, res) {
    moderateModel.getModerateCounts((result) => {
        if (result.length > 0) {
            const pendingCount = result[0].pendingCount;
            const postReports = result[0].postReports;
            const commentReports = result[0].commentReports;
            res.render('forum/moderate', { pendingCount, postReports, commentReports });
        } else {
            res.redirect('/forum');
        }
    });
});

//pending post page
router.get('/pending', function (req, res) {
    forumposts.getPendingPosts((pendingPostList) => {
        // console.log(pendingPostList);
        res.render('forum/pending', { pendingPostList });
    })
});

//pending post
router.get('/pending/:postid', function (req, res) {
    const postid = req.params.postid;
    // console.log(postid);
    forumposts.getPendingPost(postid, (data) => {
        if (!data) {
            res.send('can not get post');
        } else {
            data["user"] = req.cookies['user'];
            data["pending"] = 'yes';
            res.render('forum/post', data);
        }
    });
});
router.post('/pending/:postid', function (req, res) {
    const postid = req.params.postid;
    const decision = req.body.decision;
    // console.log(decision);

    forumposts.changeStatus(postid, decision, (status) => {
        if (status) {
            res.redirect('/forum/moderate/pending');
        } else {
            res.redirect('/forum/moderate/pending/' + postid);
        }
    });
});

//post reports
router.get('/reported-post', function (req, res) {
    const postid = req.params.postid;
    // console.log(postid);
    moderateModel.getPostReports((data) => {
        if (!data) {
            res.send('can not get post');
        } else {
            // data["role"] = req.cookies['user'].role;
            // data["pending"] = 'yes';
            res.render('forum/reports', {
                reportList: data
            });
        }
    });
});

//reported post
router.get('/reported-post/:postid', function (req, res) {
    // const postid = req.params.postid;
    // console.log(postid);
    // forumposts.getPost(postid, (data) => {
    //     if (!data) {
    //         res.send('can not get post');
    //     } else {
    //         data["role"] = req.cookies['user'].role;
    //         data["pending"] = 'yes';
    //         res.render('forum/post', data);
    //     }
    // });

    const postid = req.params.postid;
    const user = req.cookies['user'];
    postFormatter.getPost({ postid, user, type: '' }, (data) => {
        if (!data) {
            res.send('something went wrong');
        } else {
            data["reported_post"] = 'yes';
            res.render('forum/post', data);
        }
    });
});

module.exports = router;
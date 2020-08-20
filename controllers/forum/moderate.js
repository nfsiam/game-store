const express = require('express');
const moment = require('moment');
const moderateModel = require.main.require('./models/forum/moderateModel');
const postFormatter = require('./postFormatter');
const forumModel = require('../../models/forum/forumModel');

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
            const deletePostReqs = result[0].deletePostReqs;
            res.render('forum/moderate', { pendingCount, postReports, commentReports, deletePostReqs });
        } else {
            res.redirect('/forum');
        }
    });
});

//delete post req list
router.get('/delete-post-requests', function (req, res) {
    forumposts.getDeletePostReqList((deletePostReqList) => {
        res.render('forum/delpostreqs', { deletePostReqList });
    })
});
//delete post req post
router.get('/delete-post-requests/:postid', function (req, res) {
    const postid = req.params.postid;
    const user = req.cookies['user'];
    postFormatter.getPost({ postid, user, type: '' }, (data) => {
        if (!data) {
            res.send('something went wrong');
        } else {
            data["delete_requested_post"] = 'yes';
            res.render('forum/post', data);
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
            // console.log(data);
            res.render('forum/reports', {
                reportList: data
            });
        }
    });
});

//reported post
router.get('/reported-post/:postid', function (req, res) {
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


//comment reports
router.get('/reported-comment', function (req, res) {
    const postid = req.params.postid;
    // console.log(postid);
    moderateModel.getCommentReports((data) => {
        if (!data) {
            res.send('can not get post');
        } else {
            res.render('forum/reports', {
                reportList: data
            });
        }
    });
});

//reported comment
router.get('/reported-comment/:postid&:commentid', function (req, res) {
    const postid = req.params.postid;
    const commentid = req.params.commentid;
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


//delete post
router.post('/delete-post', function (req, res) {

    // console.log(req.body);
    if (req.body.postid != '') {
        const postid = parseInt(req.body.postid);

        forumposts.deletePost(postid, (result) => {
            if (result) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        });
    }
});

//delete comment
router.post('/delete-comment', function (req, res) {

    // console.log(req.body);
    if (req.body.commentid != '') {
        const commentid = parseInt(req.body.commentid);

        forumposts.deleteComment(commentid, (result) => {
            if (result) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        });
    }
});

//turn off comment for post
router.post('/turnoff-post', function (req, res) {

    // console.log(req.body);
    if (req.body.postid != '') {
        const postid = parseInt(req.body.postid);

        forumposts.changeStatus(postid, 'offcomment', (result) => {
            if (!result) {
                res.json({ failure: true });
            } else {
                res.json(result);
            }
        });
    }

});


//check turn off comment for post
router.post('/check-turnoff-post', function (req, res) {
    // console.log(req.body);
    if (req.body.postid != '') {
        const postid = parseInt(req.body.postid);

        forumposts.checkStatus(postid, 'offcomment', (result) => {
            if (result) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        });
    }

});

//mute user
router.post('/mute-user', function (req, res) {
    if (req.body.commenter != '') {
        const userToBeMuted = req.body.commenter;
        forumModel.muteUser(userToBeMuted, (result) => {
            if (!result) {
                res.json({ failure: true });
            } else {
                res.json(result);
            }
        });
    }
});


//check muted user
router.post('/check-muted-user', function (req, res) {
    if (req.body.commenter != '') {
        const username = req.body.commenter;
        forumModel.checkMutedUser(username, (result) => {
            if (!result) {
                res.json({ failure: true });
            } else {
                res.json(result);
            }
        });
    }
});

module.exports = router;
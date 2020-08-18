const express = require('express');
const moment = require('moment');
const forumposts = require.main.require('./models/forum/forumposts');
const forumModel = require.main.require('./models/forum/forumModel');
const postFormatter = require('./postFormatter');
const { registerReport } = require('../../models/forum/forumModel');
const { check, validationResult } = require('express-validator');

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
            user: req.cookies['user'],
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
        // console.log('here');
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


const mapErrors = (a) => {
    return a.reduce((accu, current) => {
        return ({
            ...accu,
            [current.param]: current.msg,
        })
    }, {});
};

//comment
router.post('/comment', [
    check('comment').trim()
        .not().isEmpty().withMessage('comment can not be empty')
        .escape(),

], function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({
            errors: mapErrors(errors.array())
        });

    } else {
        const comment = {
            comment: req.body.comment,
            postid: parseInt(req.body.postid),
            username: req.cookies["user"].username
        };
        forumposts.createComment(comment, (result) => {
            if (!result) {
                res.json({ failure: true });
            } else {
                res.json({
                    commentid: result,
                    username: comment.username,
                    comment: comment.comment,
                    time: moment().unix()
                });
            }
        });
    }
});




//report post
router.post('/report-post', function (req, res) {
    if (req.body.postid != '') {
        const report = {
            postid: parseInt(req.body.postid),
            reporttype: req.body.reporttype,
            reporter: req.cookies["user"].username,
            reportof: "post"
        }
        forumModel.reportPost(report, (result) => {
            // console.log(result);
            if (result) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        });
    }

});

//report comment
router.post('/report-comment', function (req, res) {

    // console.log(req.body);
    if (req.body.commentid != '') {
        const report = {
            postid: parseInt(req.body.postid),
            commentid: parseInt(req.body.commentid),
            reporttype: req.body.reporttype,
            reporter: req.cookies["user"].username,
            reportof: "comment"
        }
        // console.log('calling db');
        forumModel.reportComment(report, (result) => {
            // console.log(result);
            if (result) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        });
    }

});

//upvote
router.post('/upvote-post', function (req, res) {
    const postid = parseInt(req.body.postid);
    forumposts.upvotePost(postid, req.cookies['user'].username, (result) => {
        if (!result) {
            res.json({ failure: true })
        } else {
            res.json(result);
        }
    });

});
//downvote
router.post('/downvote-post', function (req, res) {
    const postid = parseInt(req.body.postid);
    forumposts.downvotePost(postid, req.cookies['user'].username, (result) => {
        if (!result) {
            res.json({ failure: true })
        } else {
            res.json(result);
        }
    });

});


//upvote comment
router.post('/upvote-comment', function (req, res) {
    const commentid = parseInt(req.body.commentid);
    forumposts.upvoteComment(commentid, req.cookies['user'].username, (result) => {
        if (!result) {
            res.json({ failure: true })
        } else {
            res.json(result);
        }
    });

});
//downvote comment
router.post('/downvote-comment', function (req, res) {
    // console.log(req.body);
    const commentid = parseInt(req.body.commentid);
    forumposts.downvoteComment(commentid, req.cookies['user'].username, (result) => {
        if (!result) {
            res.json({ failure: true })
        } else {
            // console.log('succ');
            res.json(result);
        }
    });

});


module.exports = router;
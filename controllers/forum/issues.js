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

router.get('/', function (req, res) {

    forumposts.getAllIssues((issues) => {
        for (let j = 0; j < issues.length; j++) {
            const element = issues[j];
            // console.log(landingPosts[i][j]['time']);
            const t = issues[j]['time'];
            issues[j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");

        }
        console.log(issues);
        res.render('forum/issues', { issues });
    });
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
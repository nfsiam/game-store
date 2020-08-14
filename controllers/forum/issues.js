const express = require('express');
const moment = require('moment');
const forumposts = require.main.require('./models/forum/forumposts');
const router = express.Router();

router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        console.log(req.cookies['user']);
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
        res.render('forum/issues', {
            issues,
            role: req.cookies['user'].role
        });
    });
});
router.get('/:id', function (req, res) {
    const postid = req.params.id;
    forumposts.getPost(postid, 'issue', (data) => {
        if (!data) {
            res.send('can not get post');
        } else {
            data["role"] = req.cookies['user'].role;
            res.render('forum/post', data);
        }
    });
});



module.exports = router;
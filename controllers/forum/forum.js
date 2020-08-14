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

    forumModel.getLandingPosts((landingPosts) => {
        for (let i = 0; i < landingPosts.length; i++) {
            for (let j = 0; j < landingPosts[i].length; j++) {
                const element = landingPosts[i][j];
                const t = landingPosts[i][j]['time'];
                landingPosts[i][j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");

            }
        }
        res.render('forum/forum', {
            issues: landingPosts[0],
            reviews: landingPosts[1],
            walkthroughs: landingPosts[2]
        });
    });
});



module.exports = router;
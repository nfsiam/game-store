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

    forumposts.getAllWalkthroughs((walkthroughs) => {
        for (let j = 0; j < walkthroughs.length; j++) {
            const element = walkthroughs[j];
            const t = walkthroughs[j]['time'];
            walkthroughs[j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");

        }
        console.log(walkthroughs);
        res.render('forum/walkthroughs', { walkthroughs });
    });
});



module.exports = router;
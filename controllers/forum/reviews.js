const express = require('express');
const moment = require('moment');
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

    forumposts.getAllReviews((reviews) => {
        for (let j = 0; j < reviews.length; j++) {
            const element = reviews[j];
            const t = reviews[j]['time'];
            reviews[j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");

        }
        // console.log(reviews);
        res.render('forum/reviews', {
            reviews,
            role: req.cookies['user'].role
        });
    });
});



module.exports = router;
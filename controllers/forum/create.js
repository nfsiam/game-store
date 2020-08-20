const express = require('express');
const moment = require('moment');
const createModel = require.main.require('./models/forum/createModel');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var path = require('path');




router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        if (req.cookies['user'].role != 'moderator' && req.cookies['user'].role != 'admin') {
            next();
        } else {
            res.redirect('/forum');
        }
    }
});

router.get('/', function (req, res) {
    createModel.getOwnedGames(req.cookies['user'].username, (gamelist) => {
        res.render('forum/create', {
            gamelist,
        });
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

router.post('/', [
    check('title').trim()
        .not().isEmpty().withMessage('Title can not be empty')
        .isLength({ min: 5, max: 31 }).withMessage('The length of your title must be in between 5 to 30 characters')
        .escape(),

    check('body').trim()
        .not().isEmpty().withMessage('Description can not be empty'),
    // .isLength({ max: 300 }).withMessage('The length of your description must be in between 10 to 300 characters'),

    check('gamename').not().isEmpty().withMessage('Please select a game'),
    check('type').not().isEmpty().withMessage('Please select a type')
], function (req, res) {

    const errors = validationResult(req)

    req.body["username"] = req.cookies['user'].username;

    if (!errors.isEmpty()) {
        res.json({
            errors: mapErrors(errors.array())
        });

    } else {
        const post = req.body;
        post["username"] = req.cookies['user'].username;

        createModel.createPost(post, (status) => {
            if (status) {
                res.json({ success: true })
            } else {
                res.json({ failure: true })
            }
        });
    }

});

router.post('/imageUpload', function (req, res) {
    const image = req.files.pic;
    const ext = image.mimetype.split('\/').pop();
    tpath = path.dirname(require.main.filename) + "/storage/fp/" + image.md5 + "." + ext;
    image.mv(tpath, (err) => {
        if (err) {
            res.json({});

        } else {
            res.json({ fname: image.md5 + '.' + ext })
        }
    });
});




module.exports = router;
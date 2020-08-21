const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.clearCookie('user');
    res.redirect('/login');
});

router.post('/', (req, res) => {
    res.clearCookie('user');
});

module.exports = router;
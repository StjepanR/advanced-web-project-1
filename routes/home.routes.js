const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index', {
        user: req.oidc.user
    });
});

module.exports = router;
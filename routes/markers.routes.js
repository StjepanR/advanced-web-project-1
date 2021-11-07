const express = require('express');
const {check} = require('express-validator');
const {requiresAuth} = require("express-openid-connect");
const router = express.Router();

var markers = new Set();

router.get('/', requiresAuth(), function(req, res) {
    res.json(
        markers
    );
});

router.post('/',
    requiresAuth(),
    check('latitude').not().isEmpty().withMessage('Latitude is requierd'),
    check('longitude').not().isEmpty().withMessage('Longitude is required'),
    function(req, res) {
        markers.add({latitude: req.body.latitude, longitude: req.body.longitude, name: req.oidc.user})
        res.json(
            JSON.stringify(req.oidc.user)
        );
});

module.exports = router;

const express = require('express');
const {check} = require('express-validator');
const {requiresAuth} = require("express-openid-connect");
const router = express.Router();

var markers = [];

router.get('/', function(req, res) {
    console.log(markers)
    res.json(
        markers
    );
});

router.post('/',
    check('latitude').not().isEmpty().withMessage('Latitude is requierd'),
    check('longitude').not().isEmpty().withMessage('Longitude is required'),
    (req, res) => {
        console.log(req.body);
        markers.push({latitude: req.body.latitude, longitude: req.body.longitude, name: req.oidc.user.name});
        console.log(markers);
        res.json(
            JSON.stringify(req.oidc.user)
        );
});

module.exports = router;

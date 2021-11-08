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
        try {
            markers.push({
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                name: req.oidc.user.name,
                email: req.oidc.user.email,
                time: req.oidc.user.updated_at
            });
        } catch (error) {
            console.log(error)
        }
        res.json(
            JSON.stringify(req.oidc.user)
        );
});

module.exports = router;

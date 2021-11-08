const express = require('express');
const {check} = require('express-validator');
const {auth, requiresAuth} = require("express-openid-connect");
const router = express.Router();

var markers = [];

router.get('/',
    requiresAuth(),
    function(req, res) {
    console.log(markers)
    res.json(
        markers
    );
});

router.post('/',
    requiresAuth(),
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
            if (markers.length > 5) {
                markers.pop();
            }
        } catch (error) {
            console.log(error)
        }
        res.json(
            {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                name: req.oidc.user.name,
                email: req.oidc.user.email,
                time: req.oidc.user.updated_at
            }
        );
});

module.exports = router;

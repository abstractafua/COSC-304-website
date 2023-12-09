const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    // Set the message for the login, if present
    let alert = false;
    if (req.session.alert) {
        alert = req.session.alert;
        req.session.alert = false;
    }
    res.render('forgotPassword', {
        title: "Forgot Password",
        alert: alert
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Rendering the main page
router.get('/', function (req, res) {
    let username = false;
    
    // TODO: Display user name that is logged in (or nothing if not logged in)	
    if (req.session.authenticatedUser) {
        console.log("here");
        username = req.session.authenticatedUser;
    }
    console.log(req.session.authenticatedUser);
    res.render('index', {
        title: "Kicks!",
        // HINT: Look at the /views/index.handlebars file
        // to get an idea of how the index page is being rendered
        username:username
    });
})

module.exports = router;

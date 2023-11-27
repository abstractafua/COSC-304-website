const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.post('/', function (req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.
    (async () => {
        let authenticatedUser = await validateLogin(req);
        if (authenticatedUser) {
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    })();
});

async function validateLogin(req) {
    if (!req.body || !req.body.username || !req.body.password) {
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;
    let authenticatedUser = await (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = "SELECT userid FROM customer WHERE userid=@user AND password=@pass";
            let results = await pool.request().input('user', sql.VarChar, username)
                .input('pass', sql.VarChar, password)
                .query(sqlQuery);

            if (results.recordset.length > 0) {
                let result = results.recordset[0];
                req.session.authenticatedUser = result.userid;
                return true;
            } else {

                // TODO: Check if userId and password match some customer account. 
                // If so, set authenticatedUser to be the username.

                return false;
            }
        } catch (err) {
            console.dir(err);
            return false;
        }
    })();
    return authenticatedUser;

}

module.exports = router;

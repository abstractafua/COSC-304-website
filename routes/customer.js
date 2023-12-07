const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
    // Allow user to edit their info such as address , names, password
    
    if (auth.checkAuthentication(req, res)) {
    res.setHeader('Content-Type', 'text/html');

    // Write the HTML head and link to CSS
    res.write(`<html><head><link rel="stylesheet" href="/css/main.css"></head><body class='body'>`);
    res.write('<script>');
    res.write('function edit() {');
    res.write('  window.location.href = "/editInfo";');
    res.write('}');
    res.write('</script>')
    
    // TODO: Print Customer information
    
    let Query = "SELECT * FROM customer WHERE userid = @userid";
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
	// TODO: Print customer info
        res.write("<table class='content-table'>");
        console.log(req.session.userid);
        let results = await pool.request()
                    .input('userid', sql.VarChar, req.session.authenticatedUser)
                    .query(Query);
        
        let result=results.recordset[0];
        res.write(`<tr><th>Customer ID</th><td>${result.customerId}</td></tr>`);
        res.write(`<tr><th>First Name</th><td>${result.firstName}</td></tr>`);
        res.write(`<tr><th>Last Name</th><td>${result.lastName}</td></tr>`);
        res.write(`<tr><th>E-mail</th><td>${result.email}</td></tr>`);
        res.write(`<tr><th>Phone number</th><td>${result.phonenum}</td></tr>`);
        res.write(`<tr><th>Address</th><td>${result.address}</td></tr>`);
        res.write(`<tr><th>City</th><td>${result.city}</td></tr>`);
        res.write(`<tr><th>State</th><td>${result.state}</td></tr>`);
        res.write(`<tr><th>Postal Code</th><td>${result.postalCode}</td></tr>`);
        res.write(`<tr><th>Country</th><td>${result.country}</td></tr>`);
        res.write("</table>");

        res.write("<button type='button' class='button' onclick=edit()>Edit profile</button>")
        res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function (req, res, next) {

   
    // TODO: Include files auth.jsp and jdbc.jsp
    if (auth.checkAuthentication(req, res)) {
        console.log("User is authenticated");
        // Your authenticated code here
        res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');

    res.write('<script>');
    res.write('function back() {');
    res.write('  window.location.href = "/admin";');
    res.write('}');
    res.write('</script>')
    
    let sqlQuery= "SELECT userid, email, orderId FROM customer JOIN ordersummary ON customer.customerId = ordersummary.customerId";
    // let sqlQuery="SELECT * from product";
    (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            // TODO: Write SQL query that prints out total order amount by day
            res.write("<table class='content-table'><thead><tr><th>Username</th><th>Email</th><th>Order Id</th></tr></thead>");
            console.log("error:ehre");
            let results= await pool.request().query(sqlQuery);
            console.log(results.recordset.length);
            for(let i=0;i<results.recordset.length;i++){
                let result=results.recordset[i];
                let userid=result.userid;
                let email=result.email;
                let orderId= result.orderId;
                res.write(`<tr><td>${userid}</td><td>${email}</td><td>${orderId}</td></tr>`);
            }
            res.write("</table>");
            res.write("<button type='button' class='button' onclick=back()>Back</button>")
            res.end();
        } catch (err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
        res.end();
    })();}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async function (req, res, next) {
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');
  //  res.setHeader('Content-Type', 'text/html');
    res.write("<title>Grocery CheckOut Line</title>");
    res.write("<h1>Enter your customer id and Password to complete the transaction:</h1>");
    res.write('<form id="myForm" method="get" action="/order">');
    res.write('<table><tr><td>Customer ID:</td><td><input type="text" name="customerId" size="20"></td></tr>');
    res.write('<tr><td>Password:</td><td><input type="password" name="password" size="20"></td></tr>');
    res.write('<tr><td><input type="submit" value="Submit"><input type="reset" value="Reset"></td></tr>');
    res.write('</table></form>');


    let validation = false;
    let customerId = req.query.customerId;
    let password = req.query.password;

    SQL = "SELECT * FROM customer WHERE password = @password"; // Fixed the SQL query

    try {
        if (customerId && password) {
            console.log("user info entered");
            let pool = await sql.connect(dbConfig);
            let results = await pool.request().input('password', sql.VarChar, password).query(SQL);
            console.log("Database entered");

            if (results.recordset.length <= 0) {
                res.write("<h1> The ID or password you entered was incorrect. Please go back and try again.</h1>");
            }else{
                validation = true;
            }
        }
 }catch (err) {
        console.dir(err);
       return res.write("<h1> Error...The ID or password you entered was incorrect. Please try again.</h1>");
    }
    // Ensure to call res.end at the end of the request cycle

});

// router.post('/order',function(req,res,next) {
//     res.redirect('/order')
//     res.end();
// });


module.exports = router;




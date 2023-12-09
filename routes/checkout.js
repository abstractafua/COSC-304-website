const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async function (req, res, next) {
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">');
    res.write("<title>Grocery CheckOut Line</title>");
    res.write(`<body class="bg-image" 
    style="background-image: url('/img/background.png');
          background-size: cover;">`)
    res.write("<h1>Enter your customer id and Password to complete the transaction:</h1>");
    res.write('<form id="myForm" method="get" action="/order class="text-center"">');
    res.write('<table class= "mx-auto"><tr><td>Customer ID:</td><td><input type="text" name="customerId" size="20"></td></tr>');
    res.write('<tr><td>Password:</td><td><input type="password" name="password" size="20"></td></tr>');
    res.write('<tr><td colspan="2" class="d-flex justify-content-end"><input type="submit" value="Submit"><input type="reset" value="Reset"></td></tr>');
    res.write('</table></form>');

    let validation = false;
    let customerId = req.query.customerId;
    let password = req.query.password;
    let result1=false;
    let result2=false;
    let result3 =false;

    SQL1 = "SELECT * FROM customer WHERE password = @password AND customerId=@customerId";
     // Fixed the SQL query
    SQL2 = "SELECT * FROM customer WHERE customerId=@customerId"
    SQL3 = "SELECT * FROM customer WHERE password=@password"
    try {
        if (customerId && password) {
            console.log("user info entered");
            let pool = await sql.connect(dbConfig);
             result1 = await pool.request().input('password', sql.VarChar, password).input('customerId', sql.Int, customerId).query(SQ1);
            console.log("Database entered");
            if (result1.recordset.length <= 0) {
                result1=true;
                 result2 = await pool.request().input('password', sql.VarChar, password).query(SQ2);
            }else if (result2.recordset.length <= 0) {
                result2=true;
                result3 = await pool.request().input('customerId', sql.Int, customerId).query(SQ3);
            }else if(result3.recordset.length <= 0){
             result3=true;
            }else{
              
               validation = true;
            }
            }
        
 }catch (err) {
        console.dir(err);
       return res.write("<h1> Error...The ID or password you entered was incorrect. Please try again.</h1>");
    }
    // Ensure to call res.end at the end of the request cycle

    res.end();

});

// router.post('/order',function(req,res,next) {
//     res.redirect('/order')
//     res.end();
// });

module.exports = router;




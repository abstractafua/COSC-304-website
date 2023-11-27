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
    
    let sqlQuery= "SELECT SUM(totalAmount) as totalAmount,YEAR(orderDate) as year, MONTH(orderDate) as month, DAY(orderDate) as day FROM ordersummary GROUP BY orderDate";
    // let sqlQuery="SELECT * from product";
    (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            // TODO: Write SQL query that prints out total order amount by day
            res.write("<table class='content-table'><thead><tr><th>Order Date</th><th>Total Order Amount</th></tr></thead>");
            console.log("error:ehre");
            let results= await pool.request().query(sqlQuery);
            console.log(results.recordset.length);
            for(let i=0;i<results.recordset.length;i++){
                let result=results.recordset[i];
                let orderDate= result.year+"-"+result.month+"-"+result.day;
                let totalAmount=result.totalAmount.toFixed(2);
                res.write(`<tr><td>${orderDate}</td><td>$${totalAmount}</td></tr>`);
            }
            res.write("</table>");
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
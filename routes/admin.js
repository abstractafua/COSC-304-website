const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function (req, res, next) {


    // TODO: Include files auth.jsp and jdbc.jsp
    auth.checkAuthentication(req,res);
    
    let sqlQuery= "SELECT totalAmount,orderDate FROM ordersummary";
    (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            // TODO: Write SQL query that prints out total order amount by day
            res.write("<table><thead><tr><th>Order Date</th><th>Total Order Amount</th></tr></thead>");
            console.log("error:ehre");
            let results= await pool.request().query(sqlQuery);
            console.log(results.recordset.length);
            for(let i=0;i<results.recordset.length;i++){
                let result=results.recordset[i];
                let orderDate= 1;
                let totalAmount=result.totalAmount.toFixed(2);
                res.write(`<tr><td>${orderDate}</td><td>${totalAmount}</td></tr>`);
            }
            res.write("</table>");
            res.end();
        } catch (err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;
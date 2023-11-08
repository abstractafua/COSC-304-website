const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

const app = express()

app.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>YOUR NAME Order List</title>');
    (async function(){
    /** Create connection, and validate that it connected successfully **/
    try {

        let pool = await sql.connect(dbConfig);

        let sqlQuery = "SELECT ordersummary.orderID,ordersummary.orderDate, customer.customerId, customer.firstName, cutsomer.lastName, ordersummary.totalAmount" +
                         "FROM ordersummary O JOIN customer C ON O.customerID=C.customerID";

        let sqlQuery2 = " SELECT productId, quantity, price FROM orderproduct";

        let results = await pool.request()
            .query(sqlQuery);
        
        res.write("<table><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr>");
        for (let i = 0; i < results.recordset.length; i++) {
            let result = results.recordset[i];
            res.write("<tr><td>" + result.orderID + "</td><td>" + result.orderDate + "</td></tr>"+  result.customerID + "</td><td>" 
            + result.firstName + result.lastName +  "</td></tr>"+  "</td></tr>");
        }
        res.write("</table>");

        let results2 = await pool.request().query(sqlQuery2);




        res.end();
    } catch(err) {
        console.dir(err);
        res.write(JSON.stringify(err));
        res.end();
    }
    

    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/

    /** For each order in the results
            Print out the order header information
            Write a query to retrieve the products in the order

            For each product in the order
                Write out product information 
    **/

    res.end();
}});

app.listen(3000)

module.exports = router;

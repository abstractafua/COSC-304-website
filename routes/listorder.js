const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function (req, res, next) {
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');
    res.write('<title>YOUR NAME Grocery Order List</title>');
    let sqlQuery = "SELECT ordersummary.orderID, ordersummary.orderDate, customer.customerId, customer.firstName, customer.lastName, ordersummary.totalAmount FROM ordersummary JOIN customer ON ordersummary.customerID=customer.customerID";
    let query2 = "SELECT productId, quantity, price FROM orderproduct WHERE orderId=@orderId";

    (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            console.log("It worked");
            res.write('<h1>Order list</h1>');

            let results = await pool.request().query(sqlQuery);
            res.write("<table class='content-table'><thead><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr></thead>");

            for (let i = 0; i < results.recordset.length; i++) {
                let result = results.recordset[i];
                let num = result.totalAmount.toFixed(2);

                let orderDate = new Date(result.orderDate);
                let date = orderDate.toLocaleString();

                res.write("<tr><td>" + result.orderID + "</td><td>" + date + "</td><td>"
                    + result.customerId + "</td><td>"
                    + result.firstName + ' ' + result.lastName + "</td><td>"
                    + '$' + num + "</td></tr>");

                let orderId = result.orderID;

                let results2 = await pool.request().input('orderId', sql.Int, orderId).query(query2);

                if (results2.recordset.length > 0) {
                    res.write("<td colspan='5'><table class='content-table'><tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>");

                    for (let j = 0; j < results2.recordset.length; j++) {
                        let result2 = results2.recordset[j];
                        res.write("<tr><td>" + result2.productId + "</td><td>" + result2.quantity + "</td><td>" + '$' + result2.price.toFixed(2) + "</td></tr>");
                    }

                    res.write("</table></td>");
                } else {
                    res.write("<td colspan='5'>No products found for this order.</td>");
                }
            }
            res.write("</table>");
            res.end();
        } catch (err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;



/** Create connection, and validate that it connected successfully **/
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
// let sqlQuery = "SELECT ordersummary.orderId,orderDate,customerId,customerName FROM ordersummary JOIN orderproduct ON orderSummary.orderId=orderproduct.orderId";
// let totalAmount = false;
// if(req.query.totalAmount){

// }
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>YOUR NAME Grocery Order List</title>');

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

    res.end();
});

module.exports = router;

    // Get the product name to search for
    // let name = req.query.productName;
    // (async function(){
    //          /** Create connection, and validate that it connected successfully **/
    //          try {
    //              let pool = await sql.connect(dbConfig);
        
    //              let sqlQuery = "SELECT ordersummary.orderID,ordersummary.orderDate, customer.customerId, customer.firstName, cutsomer.lastName, ordersummary.totalAmount" +
    //                              "FROM ordersummary O JOIN customer C ON O.customerID=C.customerID";
        
    //               let sqlQuery2 = "SELECT productId, quantity, price FROM orderproduct";
        
    //          /** Write query to retrieve all order headers **/
    //              let results = await pool.request().query(sqlQuery);
        
    //          /** For each order in the results
    //                  Print out the order header information
    //                  Write a query to retrieve the products in the order
        
    //                  For each product in the order
    //                      Write out product information 
    //          **/
        
    //          /**
    //          Useful code for formatting currency:
    //          /** */    
        
    //              res.write("<table><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr>");
    //              for (let i = 0; i < results.recordset.length; i++) {
    //                   let result = results.recordset[i];
                     
    //                   let num = result.totalAmount;
    //                   num = num.toFixed();
        
    //                  res.write("<tr><td>" + result.orderID + "</td><td>" + result.orderDate + "</td></tr>"+  result.customerID + "</td><td>" 
    //                  + result.firstName + result.lastName +  "</td></tr>"+ result.totalAmount + "</td></tr>");
    //              }
    //              res.write("</table>");
        
    //              let results2 = await pool.request().query(sqlQuery2);
        
    //              for (let i = 0; i < results2.recordset.length; i++) {
    //                  let results2 = results2.recordset[i];
    //                   let num2 = results2.totalAmount;
    //                   num2 = num.toFixed();
    //                  res.write("<tr><td>" + results2.productId + "</td><td>" + results2.quantity + "</td></tr>"+  results2.price );
    //              }
        
    //               res.write("</td><td></table>");
        
    //              res.end();
    //          } catch(err) {
    //              console.dir(err);
    //              res.write(JSON.stringify(err));
    //              res.end();
    //          }
    //         res.end();
    //          }
    //     )});
        
    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/


    /** Create and validate connection **/

    /** Print out the ResultSet **/

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/

    /**
        Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

        
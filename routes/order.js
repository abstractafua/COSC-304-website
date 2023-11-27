const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function (req, res, next) {
    res.write("<title>YOUR NAME Grocery Order Processing</title>");
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');
    let productList = false;
    let results=false;
    let sqlQuery = "SELECT customerId FROM customer";

    if(req.session.validation == false){
         res.write("<h1> The ID or password you entered was incorrect. Please go back and try again.</h1>");
         return res.end();
    }

    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
        customerId = req.query.customerId;
        res.write("<h1>Your Order Summary</h1>");
        (async function () {
            try {
                let pool = await sql.connect(dbConfig);
                if (customerId) { //checking if the user's customer id exists
                    sqlQuery = "SELECT customerId,firstName,lastName,address,city,state,postalCode,country FROM customer WHERE customerId = @customerId";
                    try{
                     results = await pool.request().input('customerId', sql.Int, customerId).query(sqlQuery);
                    }
                    catch(err){
                        res.write("<h3>Customer Id not found</h3>");
                        res.end();
                       return;
                    }if (results.recordset.length == 0) { //if the resultset does not return a customer id
                        res.write("<h3>Customer Id not found</h3>");
                        
                    }
                    else {// if the result set returns a customer id
                          res.write("<table><thead><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead>");
                        let resultCust= results.recordset[0];
                        let firstName=resultCust.firstName;
                        let surname=resultCust.lastName;
                        let address=resultCust.address;
                        let city=resultCust.city;
                        let state=resultCust.state;
                        let postalCode=resultCust.postalCode;
                        let country=resultCust.country;
                        
                            let total=0;
                            console.log(total); //
                            //add into ordersummary the orders from the customer
                            sqlQuery = "INSERT INTO ordersummary OUTPUT INSERTED.orderId VALUES(@a0,@a1,@a2,@a3,@a4,@a5,@a6,@a7)";
                            let result = await pool.request()
                                .input('a0',sql.DateTime,new Date())
                                .input('a1',sql.Decimal(10,2),total)
                                .input('a2',sql.VarChar,address)
                                .input('a3',sql.VarChar,city)
                                .input('a4',sql.VarChar,state)
                                .input('a5',sql.VarChar,postalCode)
                                .input('a6',sql.VarChar,country)
                                .input('a7',sql.Int,customerId)
                                .query(sqlQuery);

                                let resultOrder= result.recordset[0];
                                let orderId=resultOrder.orderId;
                                for (let i = 0; i < productList.length; i++) {
                                    product = productList[i];
                                    if (!product) { //checking if the product exists??
                                     //   res.write("<h1>Your shopping cart is empty</h1>")
                                        continue
                                    }

                                    let productId= product.id;
                                    let productQuantity= product.quantity;
                                    let productPrice=product.price;
                                    let subtotal= productQuantity*productPrice;

                                    //show the client their products
                                    res.write("<tr><td>"+productId+"</td><td>"+product.name+"</td><td>"+productQuantity+"</td><td>$"+productPrice+"</td><td>$"+subtotal.toFixed(2)+"</td></tr>");
                                    
                                    //insert the products ordered by the customer
                                    sqlQuery="INSERT INTO orderproduct OUTPUT INSERTED.orderId VALUES(@a0,@a1,@a2,@a3)";
                                     result= await pool.request()
                                    .input('a0',sql.Int,orderId)
                                    .input('a1',sql.Int,productId)
                                    .input('a2',sql.Int,productQuantity)
                                    .input('a3',sql.Int,productPrice)
                                    .query(sqlQuery);

                                    total = total + productQuantity * productPrice;
                        }
                        console.log(total);
                        sqlQuery="UPDATE ordersummary SET totalAmount = @a0 WHERE customerId= @a1";
                        result=await pool.request()
                        .input('a0',sql.Decimal(10,2),total)
                        .input('a1',sql.Int,customerId)
                        .query(sqlQuery);

                        res.write("<tr><td colspan='4' align='right'><b>Order Total</b></td>");
                        res.write("<td>$"+total.toFixed(2)+"</td></tr>");
                        res.write("</table>");

                        res.write("<h1>Order completed.  Will be shipped soon...</h1>");
                        res.write("<h1>Your order reference number is: "+orderId)+"</h1>";
                        res.write("<h1>Shipping to customer: "+ customerId+" Name: "+firstName+" "+surname+"</h1>");
                    }
                }
                else {
                    res.write("<h1>Your customer ID is incorrect</h1>")
                }
               
                // }
                //  sqlQuery = "SELECT ordersummary.orderID,ordersummary.orderDate, customer.customerId, customer.firstName, cutsomer.lastName, ordersummary.totalAmount" +
                // "FROM ordersummary O JOIN customer C ON O.customerID=C.customerID";

                //     let results = await pool.request().query(sqlQuery);

                // res.write("<table><tr><th>Order ID</th><th>Order Date</th><th>Customer ID</th><th>Customer Name</th><th>Total Amount</th></tr>");
                res.end();
            } catch (err) {
                console.dir(err);
                
                res.write(err.toString());
                res.end();
            }
             finally{
                req.session.destroy();
             
             }

        })();
    }

    else if(!req.session.productList){
        res.write("<h1>Your shopping cart is empty!</h1>");
        res.end();
    }
    else{
        res.write("<h1>Invalid customer id. Go back to the previous page and try again.</h1>");
        res.end();
    }
    
    // module.exports = router;
    /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/

    /** Make connection and validate **/


    /** Save order information to database**/
    });
          
    

module.exports = router;

//                     let result = await pool.request()
//                         .input(product.id, product.name, product.price, product.quantity, product.price)
//                         .query(sqlQuery);
//                 }
//                 let sqlQuery = "SELECT ordersummary.orderID,ordersummary.orderDate, customer.customerId, customer.firstName, cutsomer.lastName, ordersummary.totalAmount" +
//                 "FROM ordersummary O JOIN customer C ON O.customerID=C.customerID";



    /**
    // Use retrieval of auto-generated keys.
    sqlQuery = "INSERT INTO <TABLE> OUTPUT INSERTED.orderId VALUES( ... )";
    let result = await pool.request()
        .input(...)
        .query(sqlQuery);
    // Catch errors generated by the query
    let orderId = result.recordset[0].orderId;
    **/

    /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/

    /** Update total amount for order record **/

    /** For each entry in the productList is an array with key values: id, name, quantity, price **/

    /**
        for (let i = 0; i < productList.length; i++) {
            let product = products[i];
            if (!product) {
                continue;
            }
            // Use product.id, product.name, product.quantity, and product.price here
        }
    **/

    /** Print out order summary **/

    /** Clear session/cart **/


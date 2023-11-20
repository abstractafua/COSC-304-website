const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery Order Processing</title>");

    let productList = false;
    let sqlQuery = "SELECT customerId FROM customer";

    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
        customerId = req.query.customerId;

        (async function () {
            try {

                let pool = await sql.connect(dbConfig);
                if (customerId) { //checking if the user's customer id exists
                    sqlQuery = "SELECT customerId,firstName,lastName,address,city,state,postalCode,country FROM customer WHERE customerId = @customerId";
                    let results = await pool.request().input('customerId', sql.Int, customerId).query(sqlQuery);
                    if (results.recordset.length == 0) { //if the resultset does not return a customer id
                        res.write("<h3>Customer Id not found</h3>");
                    }
                    else {// if the result set returns a customer id
                        let resultCust= results.recordset[0];
                        let firstName=resultCust.firstName;
                        let surname=resultCust.lastName;
                        let address=resultCust.address;
                        let city=resultCust.city;
                        let state=resultCust.state;
                        let postalCode=resultCust.postalCode;
                        let country=resultCust.country;
                        
                            let total=0;
                            console.log(total); //how do I get the total price??
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

                                res.write("<h1>Your Order Summary</h1>");
                                res.write("<table><thead><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead>");
                                for (let i = 0; i < productList.length; i++) {
                                    product = productList[i];
                                    if (!product) { //checking if the product exists??
                                        continue
                                    }

                                    let productId= product.id;
                                    let productQuantity= product.quantity;
                                    let productPrice=product.price;
                                    //show the client their products
                                    res.write("<tr><td>"+productId+"</td><td>"+product.name+"</td><td>"+productQuantity+"</td><td>"+productPrice+"</td><td>"+productQuantity*productPrice+"</td></tr>");
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

                        res.write("<tr><td colspan='4' align='right'><b>Order Total</b></td></tr>");
                        res.write("<td align='right'>"+total+"</td></tr>");
                        res.write("</table>");

                        res.write("<h1>Order completed.  Will be shipped soon...</h1>");
                        res.write("<h1>Your order reference number is: </h1>"+orderId);
                        res.write("<h1>Shipping to customer: "+ customerId+" Name: "+firstName+surname+"</h1>");


                    }

                }
                else {
                    res.write("<h1>Your customer ID is incorrect</h1>")
                }

                res.end();
            }


            catch (err) {
                console.dir(err);
                res.write(err.toString());
                res.end();
            }

        })();
    }
    // else{
    //     res.write("<h1>Your customer ID is incorrect</h1>")
    // }
    // module.exports = router;
    /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/

    /** Make connection and validate **/

    /** Save order information to database**/


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
    res.end();
});
module.exports = router;

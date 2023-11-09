const express = require('express');
const router = express.Router();
const sql = require('mssql');


    // Rendering header
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');

    res.write("<title>Search for the products you want to buy: </title>")

    //search bar 
    res.write('<form method="get" action="EmpQuery">');
    res.write('Product Name: <input type="text" name="productName" size="25">');
    res.write('<input type="submit" value="Submit">');
    res.write('<input type="reset" value="Reset"> (Leave blank for all products)');
    res.write('</form>');
})

    // Get the product name to search for
    (async function(){
        /** Create connection, and validate that it connected successfully **/
        try {
            let pool = await sql.connect(dbConfig);
    
        /** Write query to retrieve all order headers **/
            let sqlQuery =  " SELECT productName, productPrice FROM orderproduct";
            let results = await pool.request()
                .query(sqlQuery);

            res.write("<h1>All Products</h1>");
    
        /** For each order in the results
                Print out the order header information
                Write a query to retrieve the products in the order
    
                For each product in the order
                    Write out product information 
        **/
                    res.write("<tr><th>Product Name</th><th>Price</th><th>");
                   res.write("<tr><th>Add to Cart</th><th></th><th>");
        /**
        Useful code for formatting currency:
        /** */    
            
            for (let i = 0; i < results.recordset.length; i++) {
                 let result = results.recordset[i];
                 let num = result.totalAmount;
                 num = num.toFixed();
    
                res.write("<tr><td>" + result.orderID + "</td><td>" + result.orderDate + "</td></tr>"+  result.customerID + "</td><td>" 
                + result.firstName + result.lastName +  "</td></tr>"+ result.totalAmount + "</td></tr>");
            }
            res.write("</table>");
    
            let results2 = await pool.request().query(sqlQuery2);
    
            for (let i = 0; i < results2.recordset.length; i++) {
                let results2 = results2.recordset[i];
                 let num2 = results2.totalAmount;
                 num2 = num.toFixed();
                res.write("<tr><td>" + results2.productId + "</td><td>" + results2.quantity + "</td></tr>"+  results2.price );
            }
    
             res.write("</td><td></table>");
    
            res.end();
    
        } catch(err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    
        res.end();
    })});
    
    app.listen(3000)
    
    module.exports = router;
    let name = req.query.productName;

    let sql1 = " SELECT * from "
    
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



    res.end();
});

module.exports = router;

const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const sql = require('mssql');

//let productQuery = require('./EmpProjQuery');
router.use("/listprod", list)


router.get('/', function(req, res, next) {
    // Get the product name to search for

    let name = req.query.productName; 

    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery</title>")

    res.write("<h1> Search for the products you want to buy: </h1>")

     res.write('<form method="get" action="/listprod>');
     res.write('Product Name: <input type="text" name="productName" size="25">');
     res.write('<input type="submit" value="Submit">');
     res.write('<input type="reset" value="Reset"> (Leave blank for all products)');
     res.write('</form>');

     res.write("<h2>All Products</h2>")
    
    
     let sqlQ1="SELECT product.productName, product.productPrice as price FROM product";

     if (name){
        name = "%" + req.query.productName + "%";
        sqlQ1 = sqlQ1 + "WHERE productName=@productName AND productName LIKE @productName";
    }

        (async function(){ 
            try{
                res.write("<table><tr><th></th><th>Product Name</th><th>Price</th></tr>");

                console.log("name is empty");
                let pool = await sql.connect(dbConfig); 
                console.log("sql connected");
                let results = await pool.request().query(sqlQ1);
                console.log("sql query results ready");

                for (let i = 0; i < results.recordset.length; i++) {
                    let result = results.recordset[i];
                    let productName = "" + result.productName + "";
                    console.log(productName);
                    res.write('<tr><td><a href="addcart?id=<productId>&name=<productName>&price=<productPrice>"> Add to Cart</a></td><td>' + productName + '</td><td>' + '$' + result.price.toFixed(2) + '</td></tr>');
                }

             
                res.write("</table>");

            }catch(err){
                console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
            }})();

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
 //   res.end();
});

module.exports = router;

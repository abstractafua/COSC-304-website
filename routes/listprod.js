const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>MY NAME Grocery</title>")

    res.write("<h1>Search for the products you want to buy: </h1>")

    res.write('<form method="get" action="EmpQuery">');
     res.write('Product Name: <input type="text" name="productName" size="25">');
     res.write('<input type="submit" value="Submit">');
     res.write('<input type="reset" value="Reset"> (Leave blank for all products)');
     res.write('</form>');

     res.write("<h2>All Products</h2>")
     res.write("<table><tr><th></th><th>Product Name</th><th>Price</th></tr>");


    // Get the product name to search for
    let name = req.query.productName; 
    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

     let sqlQ1="SELECT product.productName as pname, product.productPrice as price"
     +  "FROM product JOIN orderproduct ON product.productId = orderproduct.productId"

     let sqlQ12 ="SELECT product.productName as pname, productPrice as price"
     +  "FROM product JOIN orderproduct ON product.productId = orderproduct.productId" + 
        "WHERE pname = ? ";
        

        (async function(){ 
            try{

                let pool = await sql.connect(dbConfig); 
                let results = await pool.request().query(sqlQ1);
                

                for (let i = 0; i < results.recordset.length; i++) {
                    let result = results.recordset[i];
                    res.write("<tr><td> Add to Cart </td>"+ "<td>" + result.pname + "</td><td>" + $ + result.price.toFixed(2) + "</td></tr>");
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

    res.end();
});

module.exports = router;
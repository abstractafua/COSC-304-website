const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function (req, res, next) {
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');
    // Get the product name to search for


    let name = req.query.productName;
    let selectedCategory=req.query.category;

    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    // res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery</title>")

    res.write("<h1>Search for the products you want to buy: </h1>")
    res.write("<h2 id='myHeader'>All Products</h2>")
    res.write('<script>');
    res.write('function change() {');
    res.write('    var newTitle = "Products containing";');
    res.write('    var title = document.getElementById(\'myHeader\');');
    res.write('    title.innerHTML = newTitle;');
    res.write('}');
    res.write('</script>')

    

    res.write('<form method="get" action="/listprod">');
    res.write('Product Name: <input type="text" name="productName" size="25">');
   
   




    let sqlQ1 = "SELECT product.productId, product.productName, product.productPrice as price, category.categoryName FROM product JOIN category ON product.categoryId = category.categoryId";
    let category="SELECT DISTINCT categoryName FROM category";

    // if (name) {
    //     // name = "%" + req.query.productName + "%";

    //     sqlQ1 = `SELECT product.productId, product.productName, product.productPrice as price, category.categoryName FROM product JOIN category ON product.categoryId = category.categoryId WHERE product.productName LIKE @name`;

    // }


    (async function() {
        try {
            res.write(" Filter: <select name='category' id='category'>");
            let pool = await sql.connect(dbConfig);
            let results = await pool.request().query(category);
            res.write("<option value='All'>All</option>");
            for(let i=0;i<results.recordset.length;i++){
                let result=results.recordset[i];
                let categoryName=result.categoryName;
                res.write(`<option value='${categoryName}'>`+categoryName+`</option>`);
            }
            res.write("</select>");
            res.write('<input type="submit" value="Submit" onclick="change()">');
            res.write('<input type="reset" value="Reset"> (Leave blank for all products)');
            res.write('</form>');
            selectedCategory=req.query.category;
            console.log("name is empty");
            
            name = "%" + req.query.productName + "%"
            console.log(name);
            
            console.log(selectedCategory && name);
            if (selectedCategory &&name) {
                console.log("I entered here");
                sqlQ1 = `SELECT product.productId, product.productName, product.productPrice as price, category.categoryName FROM product JOIN category ON product.categoryId = category.categoryId WHERE categoryName= @categoryname AND product.productName LIKE @name `;
                results = await pool.request().input('categoryname', sql.VarChar, selectedCategory).input('name', sql.VarChar, name).query(sqlQ1);
            }
            else{
                results=await pool.request().query(sqlQ1)
            }
            
           
            res.write("<table class='content-table'><thead><tr><th></th><th>Product Name</th><th>Category</th><th>Price</th></tr></thead>");

            

           
            // if (name) {
            //     sqlQ1=`SELECT product.productId, product.productName, product.productPrice as price, category.categoryName FROM product JOIN category ON product.categoryId = category.categoryId WHERE product.productName LIKE @name`
            //     results = await pool.request().input('name', sql.VarChar, name).query(sqlQ1);
            // }
            console.log(sqlQ1);
            console.log("sql connected");

            console.log("sql query results ready");
            console.log(results.recordset.length);

            for (let i = 0; i < results.recordset.length; i++) {
                let result = results.recordset[i];
                let productName = result.productName;
                let categoryName = result.categoryName;
                let price = result.price.toFixed(2);
                

                res.write(`<tr><td><a href="addcart?id=${result.productId}&name=${encodeURIComponent(productName)}&price=${price}">Add to Cart</a></td><td>${productName}</td><td>${categoryName}</td><td>${result.price.toFixed(2)}</td></tr>`);
            }


            res.write("</table>");
            res.end();

        } catch (err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();


        }
    })();

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


});
module.exports = router;



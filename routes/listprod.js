const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async function (req, res, next) {
    try {
        // Get the product name to search for
        let name = req.query.productName;
        let selectedCategory = req.query.category;

        // Build the main content
        let content = `
            <html>
                <head>
                    <title>YOUR NAME Grocery</title>
                    <link rel="stylesheet" href="/css/main.css">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container mt-5">
                        <h1>Search for the products you want to buy</h1>
                        <script>
                            function change() {
                                var newTitle = "Products containing";
                                var title = document.getElementById('myHeader');
                                title.innerHTML = newTitle;
                            }
                        </script>
                        
                        <form method="get" action="/listprod" class="text-center">
                            Product Name <input type="text" name="productName" class="form-control" size="25">
                            Filter <select name="category" class="form-control" id="category">
                                <option value="All">All</option>`;

        let categoryQuery = "SELECT DISTINCT categoryName FROM category";
        let pool = await sql.connect(dbConfig);
        let categories = await pool.request().query(categoryQuery);

        categories.recordset.forEach(category => {
            content += `<option value="${category.categoryName}">${category.categoryName}</option>`;
        });

        content += `</select>
                    <input type="submit" class="btn btn-primary" value="Submit" onclick="change()">
                    <input type="reset" class="btn btn-secondary" value="Reset">
                </form>
            </div>
            <div class="container mt-3">
                <table class="table">
                    <thead>
                    <h2 id="myHeader">All Products</h2>
                        <tr>
                            <th></th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>`;

        let sqlQ1 = `
            SELECT product.productId, product.productName, product.productPrice as price, category.categoryName
            FROM product
            JOIN category ON product.categoryId = category.categoryId
        `;

        if (selectedCategory && name) {
            if (selectedCategory !== 'All') {
                sqlQ1 += ` WHERE categoryName = @categoryname AND product.productName LIKE @name`;
            } else {
                sqlQ1 += ` WHERE product.productName LIKE @name`;
            }

            let results = await pool
                .request()
                .input('categoryname', sql.VarChar, selectedCategory)
                .input('name', sql.VarChar, `%${name}%`)
                .query(sqlQ1);

            results.recordset.forEach(result => {
                let productName = result.productName;
                let categoryName = result.categoryName;
                let price = result.price.toFixed(2);

                content += `
                    <tr>
                        <td><a href="addcart?id=${result.productId}&name=${encodeURIComponent(productName)}&price=${price}" class="btn btn-success">Add to Cart</a></td>
                        <td><a href="product?id=${result.productId}">${productName}</a></td>
                        <td>${categoryName}</td>
                        <td>${price}</td>
                    </tr>`;
            });
        } else {
            let results = await pool.request().query(sqlQ1);

            results.recordset.forEach(result => {
                let productName = result.productName;
                let categoryName = result.categoryName;
                let price = result.price.toFixed(2);

                content += `
                    <tr>
                        <td><a href="addcart?id=${result.productId}&name=${encodeURIComponent(productName)}&price=${price}" class="btn btn-success">Add to Cart</a></td>
                        <td><a href="product?id=${result.productId}">${productName}</a></td>
                        <td>${categoryName}</td>
                        <td>${price}</td>
                    </tr>`;
            });
        }

        content += `
        <body class="bg-image" 
        style="background-image: url('/img/background.png');
              height: 100vh;
              background-size: cover;">
                </table>
            </div>
            </body>
        </html>`;

        res.send(content);
    } catch (err) {
        console.dir(err);
        res.write(JSON.stringify(err));
        res.end();
    }
});

module.exports = router;




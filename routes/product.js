const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

router.get('/', function(req, res, next) {
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');
    // res.setHeader('Content-Type', 'text/html');
    (async function() {
        let productId = req.query.id
        let sqlQuery="SELECT productName,productPrice from product WHERE productId= @productId"
        try {
            let pool = await sql.connect(dbConfig);

	// Get product name to search for
	// TODO: Retrieve and display info for the product

	// TODO: If there is a productImageURL, display using IMG tag
    
    let result= await pool.request().input('productId',sql.Int,productId).query(sqlQuery);
    console.log(result.recordset.length);
    resultProduct=result.recordset[0];
    let productName=resultProduct.productName;
    let productPrice=resultProduct.productPrice.toFixed(2);
    res.write("<h1>"+productName+"</h1>");

	// TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
    sqlQuery="SELECT productImageUrl FROM product WHERE productId=@id"
    result=await pool.request().input('id',sql.Int,productId).query(sqlQuery);
    
    if(result.recordset.length>0 && result.recordset.length!=null){ //work on getting none of the images to show there are no images
        for(let i=0;i<result.recordset.length;i++){
            let resultUrl= result.recordset[i];
            let url = resultUrl.productImageUrl
            if(url!=null){
            res.write(`<img src="${url}">`);
            }
        }
    }
    res.write(`<img src="displayImage?id=${productId}" onerror="this.style.display='none'">`); 
    res.write(`<table><tr><th>Id</th><td>${productId}</td></tr>`);
    res.write(`<tr><th>Price</th><td>${productPrice}</td></tr>`);
    res.write(`</table>`)
    //work on getting the image from display image to not show as broken image

	// TODO: Add links to Add to Cart and Continue Shopping
    
    res.write(`<h2><a href="addcart?id=${productId}&name=${encodeURIComponent(productName)}&price=${productPrice}">Add to cart</a></h2>`);
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;

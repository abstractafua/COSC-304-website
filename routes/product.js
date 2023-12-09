const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

router.get('/', function(req, res, next) {


    (async function() {
        let productId = req.query.id
        let sqlQuery="SELECT productName,productPrice,productDesc from product WHERE productId= @productId"
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
    let productDesc=resultProduct.productDesc;
    

	// TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
    sqlQuery="SELECT productImageUrl FROM product WHERE productId=@id"
    result=await pool.request().input('id',sql.Int,productId).query(sqlQuery);
    
    if(result.recordset.length>0 && result.recordset.length!=null){ //work on getting none of the images to show there are no images
        for(let i=0;i<result.recordset.length;i++){
            let resultUrl= result.recordset[i];
            let url = resultUrl.productImageUrl
            if(url!=null){;
            }
        }
    }
   
    //work on getting the image from display image to not show as broken image

	// TODO: Add links to Add to Cart and Continue Shopping
    
      SQL="SELECT * FROM review WHERE productId=@productId";    
            let poolR = await sql.connect(dbConfig);
             result=await poolR.request().input('productId',sql.Int,productId).query(SQL);

            if(result.recordset){
            let reviews = result.recordset;
            console.log(reviews);
            
            res.render('product', {productName: resultProduct.productName,
                productPrice: resultProduct.productPrice.toFixed(2),
                productId,
                reviews : reviews,
                productImages: await getProductImages(productId, pool),
        });

        }  
    }catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});


async function getProductImages(productId, pool) {
    let sqlQuery = "SELECT productImageUrl FROM product WHERE productId = @id";
    let result = await pool.request().input('id', sql.Int, productId).query(sqlQuery);

    return result.recordset.map(result => result.productImageUrl);
}


module.exports = router;



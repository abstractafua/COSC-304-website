const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

router.get('/', function(req, res, next) {


    let reviews = false;
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
    

            res.render('product', {productName: resultProduct.productName,
                productPrice: resultProduct.productPrice.toFixed(2),
                productId,
                reviews,
                productImages: await getProductImages(productId, pool),
                description:resultProduct.productDesc
        });
        } catch(err) {
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


router.get('/product/review', async (req, res) => {

    let rating;
    if (req.query.rating) {
        rating = req.query.rating
    }

    let customerId;
    if (req.session.customerId) {
        customerId = req.session.customerId
    }


    let productId;
    if (req.session.productId) {
        productId = req.session.productId
    }
    let user_comment = "";
    if (req.query.reviewComment) {
        user_comment = req.query.reviewComment
    }

        try {
            SQL ="INSERT INTO review (reviewRating, reviewDate, customerId, productId, reviewComment) VALUES (@reviewRating, @reviewDate, @customerId, @productId, @reviewComment)"
            let pool = await sql.connect(dbConfig)
            let result= await pool.request().input('reviewRating', sql.Int,rating).input('reviewDate', sql.DATETIME, new Date()).input('customerId', sql.In, customerId).input('productId', sql.Int, req.query.id).input('reviewComment', sql.VarChar(50),user_comment).query(sqlQuery);
            
            reviews = {
                reviewRating: result.recordset.reviewRating,
                comment: user_comment,
                userId: customerId,
                productId,
                date: new Date()
            }
            
        } catch (err) {
            console.dir(err)
            res.end()
        } finally {
            pool.close()
     

        res.render("/product?id=" + productId)
    res.json({ success: true, message: 'Review submitted successfully!' });

    

}});



module.exports = router;


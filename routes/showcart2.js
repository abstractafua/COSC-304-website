const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {

    let total = 0.00;
    
        let updateAmount = false;
        let removeItem = false;
        let productList = req.session.productList;

        if(productList){
        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (product) {
                product.subtotal = (product.quantity * product.price).toFixed(2);
                total += (parseFloat(product.subtotal)).toFixed(2);
            }else{
                continue;
            }
        }

        

        if(req.query.updateId){
            let updateID = req.query.updateId;
            updateAmount = req.query.updateAmount;

            for (let i = 0; i < productList.length; i++) {
                product = productList[i];
                if (!product) {
                    continue
                }

                if(product.id == updateID)
                product.quantity = updateAmount;

                SQL = "UPDATE incart SET quantity = @quantity WHERE productId=@productId";

                (async function () {
                    try {
                        let pool = await sql.connect(dbConfig);
                        await pool.request().input('quantity', sql.Int, updateAmount).input('productId',sql.Int, updateID).query(sqlQuery)

                    }catch(err){

                        console.log(err);

                    }finally{
                        pool.close()
                    }

            })
            
            }

        }


        if(req.query.delete){
            if (req.session.productList){
            removeItem = req.query.delete

            for (let i = 0; i < productList.length; i++) {
                product = productList[i];
                if (!product) {
                    continue
                }

            if(removeItem==product.id){
                SQL = "DELETE FROM incart WHERE productId=@productId";

                productList.splice(i, 1);

                (async function () {
                    try {
                        let pool = await sql.connect(dbConfig);
                        await pool.request().input('productId',sql.Int, removeItem).query(sqlQuery)
                    }catch(err){

                        console.log(err);

                    }finally{
                        pool.close()
                    }

            })
            
            }

            }

        }
    }
    }
        res.render('showcart', {product: productList, total});

    

       
});




module.exports = router;
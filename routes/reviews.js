const express = require('express');
const router = express.Router();
const sql = require('mssql');
router.get('/', function(req, res, next) {
   // res.setHeader('Content-Type', 'text/html');
    // If the product list isn't set in the session,
    // create a new list.
    
        console.log("i'm in");
        let  rating = req.query.rating
        let customerId = '3';
        let productId = req.query.id;
        let user_comment =req.query.reviewComment;

        console.log(rating);
        console.log(customerId);
        console.log(productId);
        console.log(user_comment);
        
        (async function() {
            try {
               let SQL ="INSERT INTO review(reviewRating, reviewDate, customerId, productId, reviewComment) VALUES (@reviewRating, @reviewDate, @customerId, @productId, @reviewComment)"
                console.log("comment has actually been recorded")
                let pool =  await sql.connect(dbConfig);
                  await pool.request().input('reviewRating', sql.Int,rating).input('reviewDate', sql.DATETIME, new Date().getTime).input('customerId', sql.In, customerId).input('productId', sql.Int,productId).input('reviewComment', sql.VarChar(50),user_comment).query(SQL);    
                
                      pool.close();
                
            } catch (err) {
                console.dir(err)
                res.end()
            } 

        });
    
    
            content = `<!DOCTYPE html>
            <html lang="en">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .success-message {
                        color: #4CAF50;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    .back-to-list {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.3s;
                    }
                    .back-to-list:hover {
                        background-color: #0056b3;
                    }
                </style>
            <body>
                <div class="container">
                    <div class="success-message">Your review has been successfully recorded</div>
                    <a href="/listprod" class="back-to-list">Continue Shopping</a>
                </div>
            </body>
            </html>
            `;
         
            res.send(content);
                    res.end();
         
          
         

});

module.exports = router;
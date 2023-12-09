const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
   // res.setHeader('Content-Type', 'text/html');
    // If the product list isn't set in the session,
    // create a new list.
     (async (req, res) => {
        console.log("i'm in");
        let  rating = req.query.rating
        let customerId = '3';
        let productId = req.query.productId;
        let user_comment =req.query.reviewText;
        
    
            try {
                SQL ="INSERT INTO review (reviewRating, reviewDate, customerId, productId, reviewComment) VALUES (@reviewRating, @reviewDate, @customerId, @productId, @reviewComment)"
                let pool = await sql.connect(dbConfig)
                await pool.request().input('reviewRating', sql.Int,rating).input('reviewDate', sql.DATETIME, new Date()).input('customerId', sql.In, customerId).input('productId', sql.Int, req.query.id).input('reviewComment', sql.VarChar(50),user_comment).query(sqlQuery);    
                pool.close();
                
            } catch (err) {
                console.dir(err)
                res.end()
            } 
    
    });
    
   content = `<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Review Submitted</title>
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
   </head>
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
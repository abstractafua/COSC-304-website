const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');


router.get('/', function (req, res, next) {
    // Allow user to edit their info such as address , names, password
    // Consideration of how to design account user info
    // Still show it in table but make the form entry for the rows
    // user should not be able to update email
    //give the user flexibility in updating password in edit user info
    // click submit should update database and then redirect to customer info page
    let firstName = req.query.firstName;
            let lastName = req.query.lastName;
            let phoneNum = req.query.phoneNum;
            let address = req.query.address;
            let city = req.query.city;
            let state = req.query.state;
            let postalCode = req.query.postalCode;
            let country = req.query.county;
            let password=req.query.password;

    
        res.setHeader('Content-Type', 'text/html');

        // Write the HTML head and link to CSS
        res.write(`<html><head><link rel="stylesheet" href="/css/main.css"></head><body class='body'>`);

        res.write(`
        <script>
            function save() {
                window.location.href = "/";
            }
        </script>
    `);

        // TODO: Print Customer information

        let Query = "INSERT INTO customer VALUES (@firstName,@lastName,@email,@phoneNum,@address,@city,@state,@postalCode,@country,@userid,@password)";
        (async function () {
            try {
                let pool = await sql.connect(dbConfig);
                // TODO: Print customer info
                res.write("<table class='content-table'>");
                console.log(req.session.userid);
                let results = await pool.request()
                .input('firstName', sql.VarChar, firstName)

                .input('lastName', sql.VarChar, lastName)
                .input('email', sql.VarChar, req.query.email)
                .input('phoneNum', sql.VarChar, phoneNum)
                
                .input('address', sql.VarChar, address)
                
                .input('city', sql.VarChar, city)
               
                .input('state', sql.VarChar,state)
               
                .input('postalCode', sql.VarChar, postalCode)
               
                .input('country', sql.VarChar, country)
                .input('userid', sql.VarChar, req.query.userid)
                .input('password', sql.VarChar, password)
                
                
                    .query(Query);

        
                res.write(`<style> 
        input[type=text], input[type=number] {
            width: 100%;
            padding: 12px 20px;
            box-sizing: border-box;
            border: none;
            border-bottom: 2px solid #ab30e4;
            height: 100%;
        }
    </style>`);
                res.write(`<style> 
        input[type=tel], input[type=password] {
            width: 100%;
            padding: 12px 20px;
            box-sizing: border-box;
            border: none;
            border-bottom: 2px solid #ab30e4;
            height: 100%;
        }
    </style>`);
    res.write(`<style> 
        input[type=email], input[type=password] {
            width: 100%;
            padding: 12px 20px;
            box-sizing: border-box;
            border: none;
            border-bottom: 2px solid #ab30e4;
            height: 100%;
        }
    </style>`);

                res.write(`<form method="get" action="/account">`);
                res.write(`<table class='content-table'>`);
                res.write(`<tr><th>First Name</th><td style="padding: 0;"><input type="text" name="firstName"></td></tr>`);
                res.write(`<tr><th>Last Name</th><td style="padding: 0;"><input type="text" name="lastName"></td></tr>`);
                res.write(`<tr><th>E-mail</th><td style="padding: 0;"><input type="email" name="email"></td></tr>`);
                res.write(`<tr><th>Phone number</th><td style="padding: 0;"><input type="text" name="phoneNum"></td></tr>`);
                res.write(`<tr><th>Address</th><td style="padding: 0;"><input type="text" name="address"></td></tr>`);
                res.write(`<tr><th>City</th><td style="padding: 0;"><input type="text" name="city"></td></tr>`);
                res.write(`<tr><th>State</th><td style="padding: 0;"><input type="text" name="state"></td></tr>`);
                res.write(`<tr><th>Postal Code</th><td style="padding: 0;"><input type="text" name="postalCode"></td></tr>`);
                res.write(`<tr><th>Country</th><td style="padding: 0;"><input type="text" name="country"></td></tr>`);
                res.write(`<tr><th>Username</th><td style="padding: 0;"><input type="text" name="userid"></td></tr>`);
                res.write(`<tr><th>Password</th><td style="padding: 0;"><input type="password" name="password"></td></tr>`);
                res.write(`</table>`);
                res.write(`<button type='submit' class='button'onclick="save()">Save changes</button>`);
                res.write(`</form>`);
                res.end()
            } catch (err) {
                console.dir(err);
                res.write(err + "")
                res.end();
            }
        })();
    
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('mssql');


router.get('/', function (req, res, next) {
    // Allow user to edit their info such as address , names, password
    // Consideration of how to design account user info
    // Still show it in table but make the form entry for the rows
    // user should not be able to update email
    //give the user flexibility in updating password in edit user info
    // click submit should update database and then redirect to customer info page
    

    
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
        (async function () {
            try {
                

        
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

                res.write(`<form method="post" action="/account">`);
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

async function createAccount(req,res){
    let validInput=true;
    if (!req.body.firstName || !req.body.lastName || !req.body.userid ||
        !req.body.email || !req.body.password || !req.body.address || !req.body.phoneNum ||
        !req.body.city || !req.body.state || !req.body.postalCode || !req.body.country) {

        req.session.loginMessage = "There was data missing from the account creation form. Please try again."
        return false;
    }

    let check = "SELECT * FROM customer WHERE email = @email";
    
    let Query = "INSERT INTO customer VALUES (@firstName,@lastName,@email,@phoneNum,@address,@city,@state,@postalCode,@country,@userid,@password)";
    let createaccount = await (async () => {
        

        let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email=req.body.email;
            let phoneNum = req.body.phoneNum;
            let address = req.body.address;
            let city = req.body.city;
            let state = req.body.state;
            let postalCode = req.body.postalCode;
            let country = req.body.county;
            let userid=req.body.userid;
            let password=req.body.password;


            let pool = await sql.connect(dbConfig);

            let r = await pool.request()
                    .input('email', sql.VarChar, email)
                    .query(check);
        
        console.log(r.recordset.length);
        if(r.recordset.length>0){
            console.log("I came here.");
            req.session.loginMessage="Account already exists. Login";
            validInput=false;
           return false;
        }

        
                // TODO: Print customer info
                console.log(req.session.userid);
                r = await pool.request()
                .input('firstName', sql.VarChar, firstName)

                .input('lastName', sql.VarChar, lastName)
                .input('email', sql.VarChar, email)
                .input('phoneNum', sql.VarChar, phoneNum)
                
                .input('address', sql.VarChar, address)
                
                .input('city', sql.VarChar, city)
               
                .input('state', sql.VarChar,state)
               
                .input('postalCode', sql.VarChar, postalCode)
               
                .input('country', sql.VarChar, country)
                .input('userid', sql.VarChar, userid)
                .input('password', sql.VarChar, password)
                
                
                    .query(Query);
                return true;
    })();
    return createaccount;
}

router.post('/', async function (req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.

    (async () => {
        let newAccount = await createAccount(req, res);

        if (newAccount) {
            console.log(req.session.username);
            res.redirect("/")
        }
        else{
            res.redirect("/login");
        }
    })();

});

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function (req, res, next) {
    if (auth.checkAuthentication(req, res)) {
        res.setHeader('Content-Type', 'text/html');
        res.write(`<html><head><link rel="stylesheet" href="/css/main.css"></head><body class='body'>`);


        let Query = "SELECT * FROM customer WHERE userid = @userid";
        (async function () {
            let firstName = req.query.firstName;
            let lastName = req.query.lastName;
            let phoneNum = req.query.phoneNum;
            let address = req.query.address;
            let city = req.query.city;
            let state = req.query.state;
            let postalCode = req.query.postalCode;
            let country = req.query.county;
            let password=req.query.password;

            // Construct the complete SQL query
            Query = `UPDATE customer SET firstName=IsNull(@firstName, firstName),
            lastName=IsNull(@lastName, lastName),
            phonenum=IsNull(@phoneNum, phonenum),
            address=IsNull(@address, address),
            city=IsNull(@city, city),
            state=IsNull(@state, state),
            postalCode=IsNull(@postalCode, postalCode),
            country=IsNull(@country, country),
            password=IsNull(@password,password)
             WHERE userid=@userid`;
            try {
                let pool = await sql.connect(dbConfig);
                // TODO: Print customer info
                res.write("<table class='content-table'>");
                let results = await pool.request()
                .input('firstName', sql.VarChar, firstName)
                .input('lastName', sql.VarChar, lastName)
                .input('phoneNum', sql.VarChar, phoneNum)
                .input('address', sql.VarChar, address)
                .input('city', sql.VarChar, city)
                .input('state', sql.VarChar,state)
                .input('postalCode', sql.VarChar, postalCode)
                .input('country', sql.VarChar, country)
                .input('password', sql.VarChar, password)
                .input('userid', sql.VarChar, req.session.authenticatedUser)
                    .query(Query);
                
            

                res.end()
            } catch (err) {
                console.dir(err);
                res.write(err + "")
                res.end();
            }
        })();
    }
});

module.exports = router;

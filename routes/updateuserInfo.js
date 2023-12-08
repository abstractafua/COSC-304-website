const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function (req, res, next) {
    // if (auth.checkAuthentication(req, res)) {


    //     let Query = "SELECT * FROM customer WHERE userid = @userid";
    //     (async function () {
    //         let firstName = req.query.firstName;
    //         let lastName = req.query.lastName;
    //         let phoneNum = req.query.phoneNum;
    //         let address = req.query.address;
    //         let city = req.query.city;
    //         let state = req.query.state;
    //         let postalCode = req.query.postalCode;
    //         let country = req.query.county;
    //         let password=req.query.password;

    //         // Construct the complete SQL query
    //         Query2 = `UPDATE customer SET firstName=IsNull(@firstName, @f),
    //         lastName=IsNull(@lastName, @l),
    //         phonenum=IsNull(@phoneNum, @ph),
    //         address=IsNull(@address, @add),
    //         city=IsNull(@city, @city2),
    //         state=IsNull(@state, @s),
    //         postalCode=IsNull(@postalCode, @post),
    //         country=IsNull(@country,@count),
    //         password=IsNull(@password,@pass)
    //          WHERE userid=@userid`;
    //         try {
    //             let pool = await sql.connect(dbConfig);


    //     let results = await pool.request()
    //                 .input('userid', sql.VarChar, req.session.authenticatedUser)
    //                 .query(Query);

    //     let result=results.recordset[0];
    //    let f=result.firstName;
    //     let l=result.lastName;
    //     let ph=result.phonenum;
    //     let add=result.address;
    //     let city2=result.city;
    //     let s=result.state;
    //     let post=result.postalCode;
    //     let count=result.country;
    //     let pass=result.password;

    //             results = await pool.request()
    //             .input('firstName', sql.VarChar, firstName)
    //             .input('f', sql.VarChar, f)
    //             .input('lastName', sql.VarChar, lastName)
    //             .input('l', sql.VarChar, l)
    //             .input('phoneNum', sql.VarChar, phoneNum)
    //             .input('ph', sql.VarChar, ph)
    //             .input('address', sql.VarChar, address)
    //             .input('add', sql.VarChar, add)
    //             .input('city', sql.VarChar, city)
    //             .input('city2', sql.VarChar, city2)
    //             .input('state', sql.VarChar,state)
    //             .input('s', sql.VarChar, s)
    //             .input('postalCode', sql.VarChar, postalCode)
    //             .input('post', sql.VarChar, post)
    //             .input('country', sql.VarChar, country)
    //             .input('count', sql.VarChar, count)
    //             .input('password', sql.VarChar, password)
    //             .input('pass', sql.VarChar, pass)
    //             .input('userid', sql.VarChar, req.session.authenticatedUser)
    //                 .query(Query2);



    //         }catch (err) {
    //             console.dir(err);
    //             res.write(err + "")
    //             res.end();
    //         }
    //     })();
    // }
});

router.post('/', async function (req, res) {
    console.log("Here for vibes");
    let validInput = true;
    try {
        if (auth.checkAuthentication(req, res)) {


            let Query = "SELECT * FROM customer WHERE userid = @userid";
            (async function () {
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let phoneNum = req.body.phoneNum;
                let address = req.body.address;
                let city = req.body.city;
                let state = req.body.state;
                let postalCode = req.body.postalCode;
                let country = req.body.county;
                let password = req.body.password;

                if(!firstName){ firstName= null;}
                if(!lastName) {lastName=null;}
                if(!phoneNum) {phoneNum=null;}
                if(!address) {address=null;}
                if(!city) {city=null;}
                if(!state) {state=null;}
                if(!postalCode) {postalCode=null;}
                if(!country) {country=null;}
                if(!password) {password=null;}


                // Construct the complete SQL query
                let Query2 = `UPDATE customer SET firstName=COALESCE(@firstName, @f),
                lastName=COALESCE(@lastName, @l),
                phonenum=COALESCE(@phoneNum, @ph),
                address=COALESCE(@address, @add),
                city=COALESCE(@city, @city2),
                state=COALESCE(@state, @s),
                postalCode=COALESCE(@postalCode, @post),
                country=COALESCE(@country,@count),
                password=COALESCE(@password,@pass)
                 WHERE userid=@userid`;
                try {
                    let pool = await sql.connect(dbConfig);


                    let results = await pool.request()
                        .input('userid', sql.VarChar, req.session.authenticatedUser)
                        .query(Query);

                    let result = results.recordset[0];
                    let f = result.firstName;
                    let l = result.lastName;
                    let ph = result.phonenum;
                    let add = result.address;
                    let city2 = result.city;
                    let s = result.state;
                    let post = result.postalCode;
                    let count = result.country;
                    let pass = result.password;
                    console.log(ph);


                    results = await pool.request()
                        .input('firstName', sql.VarChar, firstName)
                        .input('f', sql.VarChar, f)
                        .input('lastName', sql.VarChar, lastName)
                        .input('l', sql.VarChar, l)
                        .input('phoneNum', sql.VarChar, phoneNum)
                        .input('ph', sql.VarChar, ph)
                        .input('address', sql.VarChar, address)
                        .input('add', sql.VarChar, add)
                        .input('city', sql.VarChar, city)
                        .input('city2', sql.VarChar, city2)
                        .input('state', sql.VarChar, state)
                        .input('s', sql.VarChar, s)
                        .input('postalCode', sql.VarChar, postalCode)
                        .input('post', sql.VarChar, post)
                        .input('country', sql.VarChar, country)
                        .input('count', sql.VarChar, count)
                        .input('password', sql.VarChar, password)
                        .input('pass', sql.VarChar, pass)
                        .input('userid', sql.VarChar, req.session.authenticatedUser)
                        .query(Query2);



                } catch (err) {
                    console.dir(err);
                    res.write(err + "")
                    res.end();
                }
            })();
        }
        // Assuming validateLogin is an asynchronous function
        console.log("What is going on");
        if (validInput) {
            res.redirect("/customer");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

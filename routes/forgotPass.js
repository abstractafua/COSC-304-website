const express = require('express');
const router = express.Router();
const sql = require('mssql');


async function forgotPassed(req, res) {
    res.setHeader('Content-Type', 'text/html');

   let query="SELECT * FROM customer WHERE email=@email";
   let email= req.body.email;
    let pass1= req.body.pass1;
    let pass2= req.body.pass2;

    if(!req.body || !req.email ||!req.pass1 ||!req.pass2){
        req.session.alert = "All fields not entered";
       return false;
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        req.session.alert="Email does not exist";
        return false;
    }
    else if(pass1!=pass2){
        req.session.alert="Passwords don't match";
        return false;
    }

    await (async() =>{
        try {

            let pool = await sql.connect(dbConfig);

            let r = await pool.request()
                .input('email', sql.VarChar, email)
                .query(query);
    
            console.log(r.recordset.length);
            if (r.recordset.length <= 0) {
                console.log("I came here.");
                req.session.alert = "Email not found. Create an account";
                return false;
            }
            else{
                query="UPDATE customer SET password=@password WHERE email=@email";
                r=await pool.request()
                .input('password',sql.VarChar,password)
                .input('email',sql.VarChar,email)
                .query(query);
                return true;
            }
            
        } catch (err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
    return forgotPass;
}

router.post('/', async function (req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.

    (async () => {
        let forgotPass = await forgotPassed(req, res);

        if (forgotPass) {
            res.redirect("/login")
        }
        else {
            res.redirect("/forgotPass");
        }
    })();

});

module.exports = router;

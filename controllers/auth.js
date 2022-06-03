const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    const {name, email, password, passwordConfirm} = req.body;

    db.query('Select email From allusers Where email = ?', [email], async(error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('register', {
                message: 'email is already in use'
            })
        }
        else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'password dont match'
            });
        }

        let hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);
        
        db.query('Insert Into allusers Set ?', {name: name, email: email, password: hashedpassword }, (error, results) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
                });
            }
        })

    });

    
}
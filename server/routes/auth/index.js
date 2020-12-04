/*
    @swagger
    tags: 
        name: auth
        description: authentication endpoints
*/

const { json } = require('express');
const express = require('express');
const router = express.Router();
const joi = require('joi');
var db = require('../../database/db');
const bcrypt = require('bcrypt');



// SIGN-IN 
/**
 * @swagger
 * /singin/:
 *  post:
 *      tags: [auth]
 *      description: log in to user
 *      responses: 
 *          '200':
 *              description: success!
 */
router.post('/signin', async (req, res, next) => {

    console.log("sign in called.");

    // TODO - handle sign-in logic with actual database connection
    const { email, password } = req.body;

    if(!validEmail(email)){
        return res.status(400).json({error: "invalid email"});
    }

    db.query(`SELECT id, password From User WHERE email = "${email}"`, (err, result, fields) => { 
        if(err) {
            throw(err);
        }
        else {
            const user = result[0];
            if (!user) {
                res.status(400).json({error: "invalid email or password"});
            } else {
                if(bcrypt.compareSync(password, user.password)) {
                    const token = createAuthToken(user.id);
                    res.json({token: token});
                } else {
                    res.status(400).json({error: "invalid email or password"});
                }
            }
        }
    });
});

// SIGN-UP --------------------------------------
/**
 * @swagger
 * /signup/:
 *  post:
 *      tags: [auth]
 *      description: log in to user
 *      responses: 
 *          '200':
 *              description: success!
 */
router.post('/signup', (req, res, next) => {

    // TODO - handle sign up logic with actual database
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    db.query(`INSERT INTO User (email, password) VALUES ("${email}", "${hash}")`, (err, result, fields) => { 
        if(err) {
            if(err.code == "ER_DUP_ENTRY"){
                res.status(500).json({error: "This email is already registered to an account."});
            } else {
                throw(err);
            }
        }
        else {
            const insertedId = result.insertedId;
            const token = createAuthToken(insertedId);
            res.json({token: token});
        }
    });
});


module.exports = router;

// email validator
let validEmail = email => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return (true);
    }
    return (false);
}


let createAuthToken = userId => {
    const jwt = require("jsonwebtoken");
    return jwt.sign({
        userId: userId
    },
    "randomstring",
    {
        algorithm: "HS256"
    });
};
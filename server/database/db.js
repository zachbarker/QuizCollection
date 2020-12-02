const mysql = require('mysql');
require('dotenv').config();
const connection = mysql.createConnection({host: "localhost", database: "quizzes", user: "root", 
                                        password: process.env.DB_PASSWORD, port: process.env.DB_PORT});
connection.connect(function (err){
    if(err) {
        throw(err);
    }
    console.log('connected to mysql db');
});

module.exports = connection;
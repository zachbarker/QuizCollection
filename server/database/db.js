const mysql = require('mysql');
const connection = mysql.createConnection({host: "localhost", database: "quizzes", user: "root", 
                                        password: "root", port: "/Applications/MAMP/tmp/mysql/mysql.sock"});
connection.connect(function (err){
    if(err) {
        throw(err);
    }
    console.log('connected to mysql db');
});

module.exports = connection;
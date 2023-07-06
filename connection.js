const mysql = require("mysql");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"7773",
    database:"nodejs"
});

module.exports = connection;
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql');

const connectToMySQL = () => {
    return mysql.createConnection({
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER_OLD,
        password: process.env.PASSWORD_OLD,
        database: process.env.DB,
        ssl: {
            ca: fs.readFileSync('./mysql-cert.crt')
        },
    })
}
module.exports=connectToMySQL;
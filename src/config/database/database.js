let mysql = require("mysql2/promise.js");
let dotenv = require("dotenv");

dotenv.config();

var conn = mysql.createPool({
    host: process.env.D_HOST,
    user: process.env.D_USER,
    password: process.env.D_PASS,
    database: process.env.D_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = conn;
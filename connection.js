var mysql = require("mysql2");
var util = require("util");

var conn = mysql.createConnection({
    "host":"localhost",
    "user":"kanakdigifexcom_db_user",
    "password":"Kdigifex@7333",
    "database":"kanakdigifexcom_db",
    "port": 3306
});
var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
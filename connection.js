require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Database connected successfully");
});

// Make exe("SELECT ...") work with async/await
const exe = (sql, values = []) => {
    return connection.promise().query(sql, values)
        .then(([rows]) => rows);
};

module.exports = exe;
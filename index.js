var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");
var user_route = require("./routes/user_routes");
var admin_route = require("./routes/admin_routes");
var loginRoute = require("./routes/login");

var app = express();

// Middleweares

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());
app.use(express.static("public/"));
app.use(session({
    secret: "kanak_digifex",
    resave: false,
    saveUninitialized: true
}));

app.use("/", user_route);
app.use("/admin", admin_route);
app.use("/login", loginRoute);


const PORT = process.env.PORT || 2000;  // Port 2000 वर चालवा
const HOST = '0.0.0.0';  // सर्व incoming requests accept करण्यासाठी

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://localhost:2000`);
});

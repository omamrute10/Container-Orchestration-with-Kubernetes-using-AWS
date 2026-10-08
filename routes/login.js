var express = require("express");
var exe = require("./../connection");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("login/login.ejs");
});

router.post("/check_admin", async function (req, res) {
    var d = req.body;
    var sql = `SELECT * FROM admin_login WHERE user_name = ? AND user_password = ?`;
    var data = await exe(sql, [d.user_name, d.user_password]);

    if (data.length > 0) {
        req.session['admin_login_id'] = data[0].admin_login_id;
        res.redirect("/admin/");
    } else {
        res.send("<script>alert('Invalid Username Or Password..');location.href = '/login'</script>");
    }
});

module.exports = router;
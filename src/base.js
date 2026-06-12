let express = require("express");
let { USERS } = require("./http/controller/users");

var router = express.Router();

var user = new USERS();

router.get("/", user.index);
//router.get("/api/mock", (req, res) => user.mock(req, res));

module.exports = router;
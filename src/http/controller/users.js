let { USER_MODEL } = require("../../model/user_model");

function USERS() {
    this.db = new USER_MODEL();
};
USERS.prototype.index = function (req, res) {
    res.send('<h1>Hello</h1>');
};
USERS.prototype.mock = function (req, res) { /** */};

module.exports = { USERS };
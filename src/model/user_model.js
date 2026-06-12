let conn = require("../config/database/database");

function USER_MODEL () {
    this.connection = conn;
}
USER_MODEL.prototype.getAll = async function () {/** */};
module.exports = {USER_MODEL};
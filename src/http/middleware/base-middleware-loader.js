let express = require("express");

let { _global_limit_requests } = require("./header/ratelimit");
let { _global_headers } = require("./header/access-origin");

var middleware = express();

middleware.use(_global_limit_requests);
middleware.use(_global_headers.allowed_origin);

module.exports = middleware;
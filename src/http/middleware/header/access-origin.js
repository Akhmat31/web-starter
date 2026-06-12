let dotenv = require("dotenv");
var _global_headers = _global_headers || {};

dotenv.config();

_global_headers.allowed_origin = (req, res, next) => {
    var origin = req.headers.origin || req.headers.referer;
    if (!origin || !origin.includes(process.env.ALLOWED_ORIGIN)) {
        return res.status(403).json(
            {
                code: 401,
                error: "Access Denied"
            }
        );
    }
    next();
};
module.exports = { _global_headers };

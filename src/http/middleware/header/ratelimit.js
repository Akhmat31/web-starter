let { rateLimit } = require("express-rate-limit");

var _global_limit_requests = rateLimit({
    windowMs: 5000,
    max: 10,
    message: {
        status: 429,
        error: "Too many rikues. coba lagi nanti"
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
module.exports = {_global_limit_requests};
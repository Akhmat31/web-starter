let express      = require("express");
let cors         = require("cors");
let base         = require("./src/base");
let middleware   = require("./src/http/middleware/base-middleware-loader");

var app     = express();
var PORT    = 8000;

app.use(cors());
app.use(express.json());
app.use(middleware)
app.use(base);

app.use(function (req, res, next) {
    res.status(404).send('<h1>404 - Not Found</h1>');
});

app.listen(PORT);
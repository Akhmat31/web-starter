let { Sequelize } = require("sequelize");
let { Umzug, SequelizeStorage } = require("umzug");
let dotenv = require("dotenv");

dotenv.config();

var sequelize = new Sequelize(process.env.D_DB, process.env.D_USER, process.env.D_PASS, {
    host: process.env.D_HOST,
    dialect: process.env.DB_DRIVER
});
var umzug = new Umzug({
    migrations: {
        glob: './out/*.js',
        resolve: function ({ name, path, context }) {
            var migration = require(path);
            return {
                name,
                up: async function () { migration.up({ context }) },
                down: async function () { migration.down({ context }) },
            };
        },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

module.exports = { sequelize, umzug };

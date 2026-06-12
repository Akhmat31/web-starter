let Redis = require("ioredis");
let crypto = require("node:crypto");
let dotenv = require("dotenv");

dotenv.config()

var redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
});
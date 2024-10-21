const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-10228.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  port: 10228,
  password: process.env.password,
});

module.exports = redis;

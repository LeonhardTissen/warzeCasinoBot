// Load emvironment file
require('dotenv').config();

const TOKEN = process.env.TOKEN;
exports.TOKEN = TOKEN;

const ADMIN = process.env.ADMIN;
exports.ADMIN = ADMIN;

const PREFIX = process.env.PREFIX;
exports.PREFIX = PREFIX;
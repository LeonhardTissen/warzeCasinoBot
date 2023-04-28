// Load .env file and export them
require('dotenv').config();

const vars = ['TOKEN', 'ADMIN', 'PREFIX', 'CHANNEL', 'COLOR'];
vars.forEach((v) => {
    exports[v] = process.env[v];
});
require('dotenv').config();
const environment = process.env.CURRENT_ENV

let config = require('../knexfile');
module.exports = require('knex')(config[environment]);

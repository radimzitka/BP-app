const mongoose = require('mongoose');
const connection = require('../db');

// the schema
let schema = new mongoose.Schema({
    date: Date,
    until: Date,
    ip_address: String,
    user_agent: String,
});

// export the schema
module.exports = connection.model('Blocations', schema);
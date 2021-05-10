const mongoose = require('mongoose');
const connection = require('../db');

// the schema
let schema = new mongoose.Schema({
    date: Date,
    userId: String,
    sessionId: String,
    action: String,
    element_id: String,
    ip_address: String,
    url: String,
    method: String,
    user_agent: String,
});

// export the schema
module.exports = connection.model('Log', schema);
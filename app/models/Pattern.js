const mongoose = require('mongoose');
const connection = require('../db');

// the schema
let schema = new mongoose.Schema({
    userId: String,
    action: [String],
    element: [String],
    seconds_after_login: [Number],
    last_login: Date,
    count: Number,
});

// export the schema
module.exports = connection.model('Pattern', schema, 'patterns');
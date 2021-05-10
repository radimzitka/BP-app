const mongoose = require('mongoose');
const connection = require('../db');

// the schema
let schema = new mongoose.Schema({
    username: String,
    password: String,
    lastLogin: Date,
    logins: Number,
    nearestLogin: Date,
    blockReason: String,
});

// export the schema
module.exports = connection.model('User', schema, 'users');
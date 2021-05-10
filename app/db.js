const mongoose = require('mongoose');
const CONFIG = require('./config');

// connect to db
module.exports = mongoose.createConnection('mongodb://' + CONFIG.db.host + ':' + CONFIG.db.port + '/' + CONFIG.db.name, {
    auth: {
        authdb: CONFIG.db.name,
    },
    user: CONFIG.db.user,
    pass: CONFIG.db.password,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}, (err) => {
    if (err)
        return console.log(err);

    console.log('Connected to database');
});

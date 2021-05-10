const moment = require('moment')
const Log = require('../models/Log')
const User = require('../models/User')

// make new session
module.exports.setSession = (req, res) => {
    req.session.user = res.locals.user;
    exports.log(req, req.session.user._id, 'login');
    res.redirect('/dashboard');
}

// make a new log and save it to database
module.exports.log = function(req, userId, action = undefined){
    if(action === undefined){
        action = req.body.action;
    }
 
    new Log({
        date: moment(new Date()),
        userId: userId,
        action: action,
        sessionId: req.sessionID,
        element_id: req.body.element_id,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        url: req.url,
        method: req.method,
        user_agent: req.headers['user-agent'],
    }).save((err) => {
        if (err) {
            console.error(err);
        }
    });
}

// user logout
module.exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

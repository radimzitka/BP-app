const Log = require('../models/Log')
const User = require('../models/User')
const Blocations = require('../models/Blocations')
const Pattern = require('../models/Pattern');
const LoginCont = require('../controllers/user')
const moment = require('moment')

// Check if blocation for User agent && IP address (web browser) is active
function checkBlocations(user_id, user_agent, ip_address, callback){
    // Load all logs having the same IP address & User-agent & Log is old at most CONFIG.loginInterval
    Log.countDocuments({
        userId: user_id,
        ip_address: ip_address,
        user_agent: user_agent,
        date: {
            $gt: moment().subtract(CONFIG.badPasswordAttemptsInterval, "seconds"),
        },
        action: {
            $in: ['badPassword'],
        },
    }, (err, countLogs) => {
        if(err){
            return callback(err)
        }

        // Find valid blocation
        Blocations.findOne({
            ip_address: ip_address,
            user_agent: user_agent,
            date: {
                $gt: moment().subtract(CONFIG.IPAddressBannedMin + CONFIG.IPAddressBannedRange, "seconds"),
            },
        }, (err, blocation) => {
            if (err) {
                console.error(err);
                callback(err);
            }
            
            // Blocation was not found or founded blocation is not valid
            if(! blocation || moment(blocation.until).isBefore(new Date())){
                // No blocation created
                if(countLogs < CONFIG.badPasswordAttempts){
                    return callback(null, false)
                }
                
                // Blocation is created (users traffic is suspicious)
                let randomTime = Math.round(Math.random() * CONFIG.IPAddressBannedRange + CONFIG.IPAddressBannedMin);
                new Blocations ({
                    date: moment(),
                    until: moment().add(randomTime, "seconds"),
                    ip_address: ip_address,
                    user_agent: user_agent,
                }).save((err) => {
                    if (err) {
                        console.error(err);
                        callback(err);
                    }
                });
    
                return callback(null, true, randomTime);
            }

            // Blocation is valid
            var now = moment(new Date());
            var until = moment(blocation.until);
            var duration = Math.round(moment.duration(until.diff(now)).asSeconds());
            return callback(null, true, duration);
        })
    })
}

// Check users credentials
module.exports.checkCredentialsAndUnsuccessfullLogins = (req, res, next) => {
    User.findOne({
        username: req.body.username,
    }, (err, user) => {
        if(err){
            return res.status(500).send({
                message: 'Server error!'
             });
        }

        // User was not found
        if(! user){
            return res.redirect('/?msg=UserNotFound');
        }

        // User was found
        let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Check if there is any blocation for IP address && User-agent (web browser)
        const blocationActive = (err, blocked, blockedTime) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }

            // Redirect the user depending on the case if blocked or not
            if (blocked) {
                // Note - IP address has to be hidden, but for this purposes is worth to show IP address
                res.redirect(`/?msg=TooManyAttempts&blockedIPaddr=${ip_address}&nextLogin=${blockedTime}`);
            } else {
                /*** Bad password ***/
                if(user.password !== req.body.password){
                    LoginCont.log(req, user._id, "badPassword");
                    res.redirect('/?msg=BadPassword');

                /*** Valid password ***/
                } else {
                    User.updateOne({
                        _id: user._id,
                    }, {
                        $set: {
                            lastLogin: new Date(),
                        },
                        $inc: {
                            logins: 1,
                        }
                    }, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    })

                    // Store the user for further processing
                    res.locals.user = user;
                    next();
                }
            }
        }

        return checkBlocations(user._id, req.headers['user-agent'], ip_address, blocationActive);
    })
};

// Updates users nearest login (called if one user try to login while his blocation is valid)
function updateUserNearestLogin(userId, reason, callback){
    let randomTime = Math.round(Math.random() * CONFIG.loginIntervalBannedRange + CONFIG.loginIntervalBannedMin);

    User.findOneAndUpdate({
        _id: userId,
    }, {
        $set: {
            nearestLogin: moment().add(randomTime, 'seconds'),
            blockReason: reason,
        }
    }, (err) => {
            if(err){
                return console.error("Error while updating user.", err);
            }
            callback(randomTime);
        }
    )
}

// Load all logins in last CONFIG.loginInterval seconds and check their number
module.exports.checkLastLogs = (req, res, next) => {
    let user_id = res.locals.user._id
    // find all logins CONFIG.loginInterval before current time
    Log.find({
        userId: user_id,
        date: {
            $gt: moment().subtract(CONFIG.loginInterval, "seconds"),
        },
        action: {
            $in: ['login'],
        },
    }, (err, items) => {
        if(err){
            return res.status(500).send({
                message: 'Server error!'
             });
        }

        User.findOne({
            _id: user_id,
        }, (err, user) => {
            if(err){
                return console.error("Error while looking for user.", err);
            }

            if(items.length >= CONFIG.maxLoginsInInterval || moment(user.nearestLogin).isAfter(new Date())){
                // User was logged more than CONFIG.maxLoginsInInterval in last CONFIG.loginInterval seconds
                return updateUserNearestLogin(user_id, "TooManyLogins", (nearestLogin) => {
                    res.redirect(`/?msg=${user.blockReason}&nextLogin=${nearestLogin}`);
                })
            } else {
                // User traffic is not suspicious
                return next();
            }
        })
    })
}

// Check User Agent with a regular expression
module.exports.checkUA = (req, res, next) => {
    let regex = "Mozilla\\/5\\.0\\ \\([A-Za-z0-9;\\ ._:\\-\\/]+\\)\\ [A-Za-z0-9]+\\/([\\d]+(\\.[\\d]+){0,5})\\ \\([A-Za-z,\\ ]+\\)(\\ (Chrome|Safari|Mobile|Version|Presto|Edge|Gecko|Firefox|SamsungBrowser)(\\/([\\dE]+(\\.[\\dE]+){0,5}))*)+";
    let found = req.headers['user-agent'].match(regex);

    if(found == null){
        if(req.session){
            req.session.destroy();
        }

        return res.redirect('/badUserAgent');
    }
    
    return next();
}

function checkIdenticalApproach(pattern){
    /* +------------------------------------------------------+ */
    /* | Num. of actions on page | Num. of allowed approaches | */
    /* +------------------------------------------------------+ */
    /* |      2 actions          |    10 identical app.       | */
    /* |      3 actions          |     7 identical app.       | */
    /* |      4 actions          |     5 identical app.       | */
    /* |      5 actions          |     4 identical app.       | */
    /* |      6 actions          |     3 identical app.       | */
    /* |  7 and more actions     |     2 identical app.       | */
    /* +------------------------------------------------------+ */

    if(pattern.action.length === 2){
        return pattern.count >= 4;
    } else if (pattern.action.length === 3){
        return pattern.count >= 7;
    }  else if (pattern.action.length === 4){
        return pattern.count >= 5;
    }  else if (pattern.action.length === 5){
        return pattern.count >= 4;
    }  else if (pattern.action.length === 6){
        return pattern.count >= 3;
    }  else if (pattern.action.length >= 7){
        return pattern.count >= 2;
    }
}

// Tries to find identical behaviour in last 10 days identical users behaviour in his last session
module.exports.checkPatterns = (req, res, next) => {
    let user_id = res.locals.user._id

    // Load last log due to its login time (all records after this login time will be loaded)
    Log.findOne(
        {
            userId: user_id,
            action: 'login',
        }, null, {
            sort: {
                date: -1,
            },
        }, (err, last_log) => {

        if(err){
            console.err(err);
            return res.sendStatus(500);
        }

        // Any login was not found (first user's login)
        if(! last_log){
            return next();
        }

        // Not first login
        Log.find({
            userId: user_id,
            date: {
                $gte: moment(last_log.date),
            },
        }, (err, logs) => {

            if(err){
                console.err(err);
                return res.sendStatus(500);
            }
            
            // Load behaviour from last login
            var actions = [], elements = [], seconds_after_login = [];
            first_log = moment(logs[0].date);
        
            logs.forEach(log => {
                actions.push(log.action);
                if(log.action === 'login'){
                    seconds_after_login.push(0);
                } else {
                    seconds_after_login.push(Math.round(moment.duration(moment(log.date).diff(first_log)).asSeconds()))
                }
        
                elements.push(log.element_id);
            });
            
            // Find behaviour pattern corresponding to last login
            Pattern.findOne({
                userId: user_id,
                action: actions,
                element: elements,
                seconds_after_login: seconds_after_login,            
                last_login: {
                    $gte: moment().subtract(CONFIG.loadBehaviourPatternsDays, "days"),
                },
            }, (err, pattern) => {
                if(err){
                    console.err(err);
                    return res.sendStatus(500);
                }

                // Pattern was not found, new is created
                if(! pattern){
                    new Pattern({
                        userId: user_id,
                        action: actions,
                        element: elements,
                        seconds_after_login: seconds_after_login,
                        last_login: new Date(),
                        count: 1,
                    }).save((err) => {
                        if(err){
                            console.err(err);
                            return res.sendStatus(500);
                        }
                    });

                    return next();
                }

                // Pattern was found, check its counter according to the table
                else if( checkIdenticalApproach(pattern) ){
                    Pattern.updateOne({
                        _id: pattern._id
                    },  {
                        $inc: {
                            count: -1,
                        }
                    }, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    })

                    // Number of allowed repeatings was exceeded, users account is blocated
                    return updateUserNearestLogin(user_id, "SuspiciousTraffic", (nearestLogin) => {
                        res.redirect(`/?msg=SuspiciousTraffic&nextLogin=${nearestLogin}`);
                    });
                
                // Pattern was found, but count of repeatings is OK, increment patterns count
                } else {
                    Pattern.updateOne({
                        _id: pattern._id,
                    },  {
                        $set: {
                            last_login: new Date(),
                        },
                        $inc: {
                            count: 1,
                        }
                    }, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    })
                    return next();
                }
            })

        });
    });
}

/**
 * The entry point of the Socnet social network
 * @author Radim Zitka
 */

/*
 * It is neccessary to run Redis server via command:
 * 'redis-server /usr/local/etc/redis.conf'
 */


/**
 * Global configuration
 */
 global.CONFIG = require('./config');
 
 /**
  * Libraries
  */
 const express = require('express');
 const app = express();
 const path = require('path');
 const bodyParser = require('body-parser');
 const session = require('express-session');
 const redis = require('redis');
 const redisStore = require('connect-redis')(session);
 
// connect to redis server
const redisClient = redis.createClient();
const store = new redisStore({
    host: 'localhost', 
    port: 6379,
    client: redisClient,
    ttl: 86400,
    resave: true,
});

// set to use redis store to saving session data (if in production mode)
app.use(session({
    secret: 'aidhfiadsfhf',
    store: store,
    name: CONFIG.sessionName,
    resave: true,
    saveUninitialized: false,
    cookie: {
        path: '/',
        // domain: CONFIG.hostname,
        maxAge: 86400000,
    },
}));

// set extended urlencoded to true (post)
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Allow images and other static files 
app.use( express.static( "views" ) );

// set up views directory and engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// blocked ips
const ips = [];

const router = require('./router');
app.use('/', (req, res, next) => {
    const visitorIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ips.includes(visitorIP)) {
        return res.status(401).send("SMULA")
    }

    next()
}, router);

app.listen(CONFIG.port, () => {
    console.log("Server has started on port ", CONFIG.port)
});

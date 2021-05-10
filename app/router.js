const router = require('express').Router();

const homepageController = require('./controllers/homepage')
const userController = require('./controllers/user')
const dashboardController = require('./controllers/dashboard')
const loginFirewall = require('./firewall/login')

router.get('/', homepageController.render)
router.get('/badUserAgent', homepageController.renderBadUA)
router.post('/login', loginFirewall.checkCredentialsAndUnsuccessfullLogins, loginFirewall.checkLastLogs, loginFirewall.checkUA, loginFirewall.checkPatterns, userController.setSession)
router.get('/logout', userController.logout)

router.all('*', (req, res, next) => {
    // Validity of session
    if(!req.session.user){
        return res.redirect('/')
    }
    next()
})

router.get('/dashboard', loginFirewall.checkUA, dashboardController.render)
router.post('/log', dashboardController.log)

module.exports = router;
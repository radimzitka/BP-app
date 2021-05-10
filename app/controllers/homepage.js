const fs = require('fs')

module.exports.render = (req, res) => {
    if(req.session.user){
        res.redirect("/dashboard");    
    }

    // render the page
    res.render("homepage", {
        data: req.query.msg,
        nextLogin: req.query.nextLogin,
        blockedIPaddr: req.query.blockedIPaddr,
        logout_button:  false,
    });
};

module.exports.renderBadUA = (req, res) => {
    // render the page with warning Bad User Agent
    res.render("badUserAgent");
};
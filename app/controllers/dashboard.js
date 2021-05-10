const userController = require('./user')

module.exports.render = (req, res) => {
    res.render('dashboard', {
        username: req.session.user.username,
        logout_button:  true,
    })
};

module.exports.log = (req, res) => {
    userController.log(req, req.session.user._id);
    res.sendStatus(200);
};
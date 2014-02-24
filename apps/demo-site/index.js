var express = require('express'),
    passport = require('passport'),
    renderStack = require('bauhausjs/page/middleware').renderStack;

module.exports = function (bauhausConfig) {
    var app = express();
    app.get('*', renderStack(bauhausConfig.pageTypes, bauhausConfig.contentTypes));

    app.post('/login',
        passport.authenticate('local', { successRedirect: '/',
                                         failureRedirect: '/login',
                                         failureFlash: true })
    );

    app.get('/login', function (req, res) {
        var flash = req.flash();
        res.render(__dirname + '/templates/login.ejs', { error: flash.error });
    });

    return app;
}
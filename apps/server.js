var express = require('express'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    session = require('connect-mongo')(express),
    passport = require('../config/passport'),
    securityMiddleware = require('bauhausjs/security/middleware');

module.exports = function (bauhausConfig) {
    var server = express();

    // Add app middleware
    server.use(express.cookieParser());
    server.use(express.json());
    server.use(express.urlencoded());
    server.use(express.session({
        store: new session({ mongoose_connection: mongoose.connection }),
        secret: bauhausConfig.security.sessionSecret, 
        path: '/',
        maxAge: 100 * 60 * 60 * 24
    }));
    server.use(flash());
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(securityMiddleware.loadUser);

    return server;
};
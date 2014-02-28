var express = require('express'),
    passport = require('passport'),
    routes = require('bauhausjs/backend/routes'),
    path = require('path');

module.exports = function (bauhausConfig) {
    var app = express(),
        env = bauhausConfig.env;

    var route = '/backend';

    var buildOptions = {
        env: env,
        angular: {
            modules: ['ngResource', 'ngRoute', 'slugifier', 'bauhaus.general', 'bauhaus.dashboard', 'bauhaus.page', 'bauhaus.user', 'bauhaus.role', 'bauhaus.document']
        },
        html: {
            dest: path.join(__dirname, 'build/client')
        },
        copy: {
            dest: path.join(__dirname, 'build/client')
        },
        js: {
            dest: path.join(__dirname, 'build/client')
        },
        css: {
            concat: 'css/all.css',
            dest: path.join(__dirname, 'build/client')
        },
        less: {
            paths: [ path.join(__dirname, 'client/css') ]
        }
    };

    build = require('./build')(buildOptions)

    if (env === 'development') {
        build.start.apply(build, ['development']);
    } else {
        build.start.apply(build, ['production']);
    }

    // Register routes from routes.js
    var templateDir = path.join(__dirname, 'build/templates');
    routes(app, templateDir);

    // add client as static folder
    app.use(express.static( path.join(__dirname, 'build/client')));

    var passportStrategyConf = { 
        successRedirect: route + '/',
        failureRedirect: route + '/login',
        failureFlash: true 
    };
    app.post('/login', passport.authenticate('local', passportStrategyConf) );

    bauhausConfig.security.permissions.backend = ['login'];

    return app;
}
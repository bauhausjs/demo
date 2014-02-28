var Page = require('bauhausjs/page/model/page'),
    User = require('bauhausjs/security/model/user')
    debug = require('debug')('bettervest:installer');

module.exports = function () {
    hasRoot(function (doesHaveRoot) {
        if (!doesHaveRoot) {
            debug("Project missing root page, running initial setup");

            createRootPage(function (rootPage) {
                debug("Created Root Page");
            });
            createTestUser(function () {
                debug("Created test/test user");
            });
        }
    });

    function hasRoot (callback) {
        Page.findOne({ parentId: null, public: true }, function (err, rootPage) {
            if (err) {
                console.log(err); 
                return;
            }
            if (rootPage === null) {
                callback(false);   
            } else {
                callback(true);
            }

        })
    }

    function createRootPage (callback) {
        var rootPage = new Page({
            title: 'Home',
            route: '/',
            _type: 'home',
            public: true
        });

        rootPage.save(function (err, page) {
            if (err) console.log('Failed creating page', page);
            callback(page);
        });
    }

    function createTestUser (callback) {
        var testUser = new User({
            username: 'test'
        });
        User.register(testUser,'test', function () {
            callback();
        });
    }
};
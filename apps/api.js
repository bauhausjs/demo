var express = require('express'),
    securityApi = require('bauhausjs/security/api')
    pageApi = require('bauhausjs/page/api'),
    contentApi = require('bauhausjs/content/api'),
    documentApi = require('bauhausjs/document/api');

module.exports = function (bauhausConfig) {
    var app = express();

    app.use(securityApi(bauhausConfig));
    app.use(pageApi(bauhausConfig));
    app.use(contentApi(bauhausConfig));
    app.use(documentApi(bauhausConfig));

    return app;
}
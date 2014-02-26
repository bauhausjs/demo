var contentTypes = require('./contentTypes'),
    pageTypes = require('./pageTypes'),
    customUserFields = require('./customUserFields');

// Build configuration
var bauhausConfig = module.exports = {
    port: Number(process.env.PORT || 1919),
    env: process.env.NODE_ENV || 'development',

    mongodb: process.env.MONGOHQ_URL || 'mongodb://localhost/bauhausjs_example',

    contentTypes: contentTypes,
    pageTypes: pageTypes,

    documents: {},
    addDocument: function (name, config) {
        this.documents[name] = config;
    },

    customUserFields: customUserFields,
    addCustomUserField: function (fields) {
        fields = Array.isArray(fields) ? fields : [fields];
        for (var f in fields) {
            this.customUserFields.push(fields[f]);
        }
    },

    security: {
        sessionSecret: ' c7294rc2p2pcrxpe3mpx1r3pnc479tcn240mgubr',
        path: '/',
        maxAge: 100 * 60 * 60 * 24,

        permissions: {},
        addPermission: function (pluginName, permissions) {
            this.permissions[pluginName] = permissions;
        },
    }
};
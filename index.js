var mongoose = require('mongoose');

// Config
var bauhausConfig = require('./config');

// Create db connection
var db = mongoose.connect(bauhausConfig.mongodb);

// Apps
var server = require('./apps/server')(bauhausConfig),
    api = require('./apps/api')(bauhausConfig),
    admin = require('./apps/admin')(bauhausConfig),
    website = require('./apps/demo-site/')(bauhausConfig);

// Add individual site apps
server.use('/backend/api', api);
server.use('/backend', admin);
server.use(website);
server.listen(bauhausConfig.port);
require('bauhausjs/util/cli').welcome(server);
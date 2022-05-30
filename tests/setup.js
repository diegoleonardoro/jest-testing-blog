jest.setTimeout(50000);
Number.prototype._called = {};

require('../models/User');

const mongoose = require('mongoose');

const keys = require('../config/keys');

// we tell mongoose to use the Node global promise object.
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient:true}) ;


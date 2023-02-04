const back = require('androidjs').back;
const path = require('path');
const applicationdf = require('./app.js');
const appe = require('./script.js');

back.on("hello from front", function() {
    back.send("hello from back", "Hello from Android JS");
});
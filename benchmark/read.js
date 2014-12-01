'use strict';

var Hammer = require('hammertime');
var Netstring = require('../lib/netstring');

var buffer;

Hammer({
    iterations: 100000,
    before: function (run) {
        buffer = Netstring.write('hello world!');
        run();
    },
    after: function (results) {
        console.log(results);
    }
})
.time(function () {
    Netstring.read(buffer);
});

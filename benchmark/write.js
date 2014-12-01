'use strict';

var Hammer = require('hammertime');
var Netstring = require('../lib/netstring');

Hammer({
    iterations: 100000,
    before: function (run) {
        run();
    },
    after: function (results) {
        console.log(results);
    }
})
.time(function () {
    Netstring.write('hello world!');
});

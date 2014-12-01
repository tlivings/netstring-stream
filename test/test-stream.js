'use strict';

var Test = require('tape');
var Netstring = require('../lib/netstring');

Test('write', function (t) {

    t.test('value', function (t) {
        var ns = Netstring.writeStream();

        ns.pipe(Netstring.readStream()).pipe(process.stdout);
        ns.write('hello world!');
        ns.write('goodbye!');
        ns.end();

        t.end();
    });
});

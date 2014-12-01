'use strict';

var Test = require('tape');
var Netstring = require('../lib/netstring');

Test('write', function (t) {

    t.test('value', function (t) {
        t.plan(1);

        var buff = Netstring.write('hello world!');

        t.strictEqual(buff.toString(), '12:hello world!,', 'wrote as expected.');
    });

    t.test('empty', function (t) {
        t.plan(1);

        var buff = Netstring.write();

        t.strictEqual(buff.toString(), '0:,', 'wrote as expected.');
    });

});

Test('read', function (t) {

    t.test('value', function (t) {
        t.plan(1);

        var str = Netstring.read(new Buffer('12:hello world!,'));

        t.strictEqual(str.toString(), 'hello world!', 'read as expected.');
    });

    t.test('multi value', function (t) {
        t.plan(3);

        var str = Netstring.read(new Buffer('12:hello world!,7:goodbye,'));

        t.ok(typeof str === 'object' && str.length, 'is array.');
        t.strictEqual(str[0].toString(), 'hello world!', 'read first element as expected.');
        t.strictEqual(str[1].toString(), 'goodbye', 'read second element as expected.');
    });

    t.test('empty', function (t) {
        t.plan(1);

        var str = Netstring.read();

        t.strictEqual(str.toString(), '', 'read as expected.');
    });

});

Test('end to end', function (t) {
    t.plan(4);

    var str = Netstring.read(['hello world!', 'how are you doing?', 'goodbye.'].map(function (str) { return Netstring.write(str); }).join(''));

    t.ok(typeof str === 'object' && str.length, 'is array.');
    t.strictEqual(str[0].toString(), 'hello world!', 'read first element as expected.');
    t.strictEqual(str[1].toString(), 'how are you doing?', 'read second element as expected.');
    t.strictEqual(str[2].toString(), 'goodbye.', 'read third element as expected.');

});

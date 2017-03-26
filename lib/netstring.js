'use strict';

var Stream = require('through2');
var Debuglog = require('util').debuglog;

var debug = Debuglog('nstring');

module.exports = {
    read: read,
    write: write,
    readStream: createReader,
    writeStream: createWriter
};

function createReader() {
    return Stream({objectMode: false, allowHalfOpen: true}, function readNetstring(data, encoding, callback) {
        var strings;

        strings = read(data, encoding);

        for (var i = 0; i < strings.length; i++) {
            this.push(strings[i]);
        }

        callback();
    });
}

function read(data, encoding) {
    var size, strings;

    size = 0;
    strings = [];

    if (encoding === 'buffer') {
        encoding = null;
    }
    else {
        data = new Buffer(data || '', encoding);
    }

    for(var i = 0; i < data.length; i++) {
        var offset, c;

        c = data[i];

        if (c === 58) {
            offset = i + 1;
            size = parseInt(data.toString(encoding, size, i));
            strings.push(data.slice(offset, offset + size));
            i += size + 1;
            size += offset + 1;
            continue;
        }
    }

    debug('[%s] <---- %s', strings, data);

    return strings;
}

function createWriter() {
    return Stream({objectMode: false, allowHalfOpen: true}, function writeNetstring(data, encoding, callback) {
        this.push(write(data, encoding));
        callback();
    });
}

function write(data, encoding) {
    var buffer;

    if (encoding === 'buffer') {
        encoding = null;
    }
    else {
        data = new Buffer(data || '', encoding);
    }

    buffer = Buffer.concat([new Buffer(data.length + ':', encoding), data, new Buffer(',', encoding)]);

    debug('%s ----> %s', data, buffer);

    return buffer;
}

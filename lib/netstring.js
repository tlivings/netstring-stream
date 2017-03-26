'use strict';

const Stream = require('through2');
const Debuglog = require('util').debuglog;

const debug = Debuglog('nstring');

const read = function (data, encoding) {
    let size = 0;
    const strings = [];

    if (encoding === 'buffer') {
        encoding = null;
    }
    else {
        data = new Buffer(data || '', encoding);
    }
    
    for(let i = 0; i < data.length; i++) {
        const c = data[i];

        if (c === 58) {
            const offset = i + 1;
            size = parseInt(data.toString(encoding, size, i));
            strings.push(data.slice(offset, offset + size));
            i += size + 1;
            size += offset + 1;
            continue;
        }
    }

    debug('[%s] <---- %s', strings, data);

    return strings;
};

const write = function (data, encoding) {
    if (encoding === 'buffer') {
        encoding = null;
    }
    else {
        data = new Buffer(data || '', encoding);
    }

    const buffer = Buffer.concat([new Buffer(data.length + ':', encoding), data, new Buffer(',', encoding)]);

    debug('%s ----> %s', data, buffer);

    return buffer;
};

const createReader = function () {
    return Stream({objectMode: false, allowHalfOpen: true}, function readNetstring(data, encoding, callback) {
        const strings = read(data, encoding);

        for (let i = 0; i < strings.length; i++) {
            this.push(strings[i]);
        }

        callback();
    });
};

const createWriter = function () {
    return Stream({objectMode: false, allowHalfOpen: true}, function writeNetstring(data, encoding, callback) {
        this.push(write(data, encoding));
        callback();
    });
};

module.exports = {
    read: read,
    write: write,
    readStream: createReader,
    writeStream: createWriter
};
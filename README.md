# netstring-stream

Netstring reader/writer and streams.

### Read/Write Usage

```javascript
var Netstring = require('netstring-stream');

Netstring.write('hello world!'); //12:hello world!,

Netstring.read('12:hello world!,'); //hello world!
```

### Transform Stream Usage

```javascript
var writer = Netstring.writeStream();

writer.pipe(Netstring.readStream()).pipe(process.stdout);

writer.write('hello world!');
writer.write('goodbye!');

writer.end();
```

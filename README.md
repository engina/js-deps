# js-deps

[![Build status](https://img.shields.io/travis/engina/js-deps.svg?style=flat-square)](https://travis-ci.org/request/request)
[![Coverage](https://img.shields.io/codecov/c/github/engina/js-deps.svg?style=flat-square)](https://codecov.io/github/request/request?branch=master)

Simple Reg Exp based dependency parser for nodejs source files that is supposed to cover 99% of the cases.

It can parse require statements like this:
```javascript
const Promise   = require('bluebird');
const path      = require('path');
const fse       = Promise.promisifyAll(require('fs-extra'));
const request   = require('request');
const fs        = require('fs');
const https     = require('https');
const Throttler = require('./throttler');
const Throttler = require('./throttler.js');
const isStream  = require('is-stream');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const got = require('got');
const got = require("got.js");
const got2=require('hello1');
const got2= require('hello2');
const got2 =require('hello3');
var got2 =require('hello4');
let got2 =require('hello5');
got2 =require('hello6');
//got2 =require('should not be found');
```

The output will be:

```javascript
[
  'bluebird',
  'path',
  'fs-extra',
  'request',
  'fs',
  'https',
  './throttler',
  './throttler.js',
  'is-stream',
  'eventemitter2',
  'got',
  'got.js',
  'hello1',
  'hello2',
  'hello3',
  'hello4',
  'hello5',
  'hello6'
]
```
### Caveats
1. It doesn't parse more than one require per line.
2. It doesn't parse module.exports = require() type of lines either.

Since deps is supposed to be used in your build toolchain for your own code and it is very easy to re-write not supported formats into supported ones. These two cases are not covered.
  
## Install
-------
```
npm install js-deps
```

## Usage
-----
```javascript
var deps = require('js-deps');
// To parse a source code's requires and get the dependencies as an array
deps.parseDeps(sourceCodeString);
// To parse a JS file and walk its requires recursively.
// Returns an array of absolute paths of all requires.
deps.analyze(filePath);
```

## CLI
Install via:
```
npm install -g js-deps
```

## Usage
This will output local requires (starting with ./) for the source.js
```
js-deps source.js
```
See help for all arguments
```
js-deps -h
```

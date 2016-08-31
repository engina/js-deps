module.exports.fs = {
  '/home/foo/a.js': 'var b = require("./b");',
  '/home/foo/b.js': 'var c = require("./c");',
  '/home/foo/c.js': 'var a = require("./a");',

  '/home/foo/d.js': 'var a = require("./lib/e");\nvar b = require("./lib/f")\n',
  '/home/foo/lib/e.js': 'var a = require("../b");',
  '/home/foo/lib/f.js': 'var a = require("hello");\nvar b = require("./g")',
  '/home/foo/lib/g.js': 'var c = require("hello2")'
};

module.exports.source = `const Promise   = require('bluebird');
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
    spacePadded = require('spacePadded');
// Hello
`;


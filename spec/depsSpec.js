var test = require('tape');
var mock = require('mock-fs');
var deps = require('../index');
var fixtures = require('./fixtures');

test('should parse deps properly', t => {
  var actual = deps.parseDeps(fixtures.source);
  var expected = [
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
    'hello6',
    'spacePadded'
  ];
  t.deepEqual(actual, expected, 'yes');
  t.end();
});

test('should handle cyclic dependency', t => {
  mock(fixtures.fs);
  var expected = [
    '/home/foo/b.js',
    '/home/foo/c.js',
    '/home/foo/a.js'
  ];
  var actual = deps.analyze('/home/foo/a.js');
  mock.restore();
  t.deepEqual(actual, expected);
  t.end();
});

test('should handle give proper result even with cyclic dependency', t => {
  mock(fixtures.fs);
  var actual = deps.analyze('/home/foo/d.js');
  var expected = [
    '/home/foo/lib/e.js',
    '/home/foo/b.js',
    '/home/foo/c.js',
    '/home/foo/a.js', // this loops back to b, so is cyclic
    '/home/foo/lib/f.js',
    'hello',
    '/home/foo/lib/g.js',
    'hello2'
  ];
  t.deepEqual(actual, expected);
  mock.restore();
  t.end();
});

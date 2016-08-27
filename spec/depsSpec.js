const test = require('tape');
const mock = require('mock-fs');
const deps = require('../index');
const fixtures = require('./fixtures');

test('should parse deps properly', t => {
  let actual = deps.parseDeps(fixtures.source);
  let expected = [
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
  ];
  t.deepEqual(actual, expected, 'yes');
  t.end();
});

test('should handle cyclic dependency', t => {
  mock(fixtures.fs);
  let expected = [
    '/home/foo/b.js',
    '/home/foo/c.js',
    '/home/foo/a.js'
  ];
  let actual = deps.analyze('/home/foo/a.js');
  mock.restore();
  t.deepEqual(actual, expected);
  t.end();
});

test('should handle give proper result even with cyclic dependency', t => {
  mock(fixtures.fs);
  let actual = deps.analyze('/home/foo/d.js');
  let expected = [
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

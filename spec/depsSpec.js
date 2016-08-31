var test = require('tape');
var mock = require('mock-fs');
var deps = require('../index');
var fixtures = require('./fixtures');

test('js-dep', t => {
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
  t.deepEqual(actual, expected, 'should parse supported require formats');
  t.end();
});

test('js-dep', t => {
  mock(fixtures.fs);
  var expected = [
    '/home/foo/b.js',
    '/home/foo/c.js',
    '/home/foo/a.js'
  ];
  var actual = deps.analyze('/home/foo/a.js');
  mock.restore();
  t.deepEqual(actual, expected, 'should handle cyclic dependencies');
  t.end();
});

test('js-dep', t => {
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
  t.deepEqual(actual, expected, 'should give proper result even with cyclic dependency');
  mock.restore();
  t.end();
});

test('js-dep', t => {
  mock(fixtures.fs);
  try {
    var actual = deps.analyze('/home/foo/missing-require.js');
    var expected = ['/home/foo/does-not-exist.js'];
    t.deepEqual(actual, expected, 'should handle missing requires');
  } catch (err) {
    t.fail('should handle missing requires');
  }
  t.end();
  mock.restore();
});

test('js-dep when given a source with cyclic dependency', t => {
  mock(fixtures.fs);
  try {
    deps.analyze('/home/foo/a.js', {ignoreCyclic: false});
    t.fail('should throw an exception if ignorCyclic is false');
  } catch (err) {
    t.pass('should throw an exception if ignorCyclic is false');
  }
  t.end();
  mock.restore();
});

test('js-dep when given a js file with missing local requires', t => {
  mock(fixtures.fs);
  try {
    deps.analyze('/home/foo/missing-require.js', {ignoreMissing: false});
    t.fail('should throw an exception if ignoreMissing is false');
  } catch (err) {
    t.pass('should throw an exception if ignoreMissing is false');
  }
  t.end();
  mock.restore();
});

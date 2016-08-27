#!/usr/bin/env node

var deps = require('./index');
var argv = require('yargs')
.usage('$0 [args] file')
.demand(1)
.alias('a', 'all')
.describe('a', 'Display all dependencies, not just local.')
.alias('j', 'json')
.describe('j', 'Output in JSON format')
.help()
.alias('h', 'help')
.argv;

var result = deps.analyze(deps.normalize(argv._[0]));

if (!argv.all) {
  result = result.filter(val => val[0] === '/');
}

if (argv.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  for (var r of result) {
    console.log(r);
  }
}

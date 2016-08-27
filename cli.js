const deps = require('./index');
const argv = require('yargs')
.usage('$0 [args] file')
.demand(1)
.alias('a', 'all')
.describe('a', 'Display all dependencies, not just local.')
.alias('j', 'json')
.describe('j', 'Output in JSON format')
.help()
.alias('h', 'help')
.argv;

let result = deps.analyze(deps.normalize(argv._[0]));

if (!argv.all) {
  result = result.filter(val => val[0] === '/');
}

if (argv.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  for (let r of result) {
    console.log(r);
  }
}

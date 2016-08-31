var fs   = require('fs');
var path = require('path');

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Extracts require() parameters from the source code by use of regular
 * expressions. See spec/fixtures.js and spec/depsSpec.js for supported
 * formats.
 *
 * Live playground is here: https://regex101.com/r/xW3lQ2/5
 *
 * Does not recurse. For that @see analyze.
 *
 * @param {string} source code to be parsed
 * @return {Array} dependencies
 */
function parseDeps(source) {
  var re = /^\s*(?:(?:const|var|let)\s+)?\w+\s*\=.*(?:require\((?:\'|\"))(.*)(?:\'|\").*$/gm;
  var m;
  var result = [];
  while ((m = re.exec(source)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    result.push(m[1]);
  }
  return result;
}

/**
 * If the file name lacks .js extension, it appends one.
 *
 * This assumes that the file system in question is case insensitive,
 * as it would fail if the file is foo.JS and the file system is case sensitive
 *
 * @param {string} filename File name.
 * @return {string} Normalized path
 */
function normalize(filename) {
  if (!filename.endsWith('.js')) {
    // assuming the fs is case insensitive
    filename += '.js';
  }
  return filename;
}

/**
 * Analyzes file and all its dependencies recursively.
 *
 * @emit error on cyclic file dependencies
 * @emit verbose whenever a dependency path is completed, meaning that the end
 * of the requirement path is reached. verbose event will be fired with Array
 * of said dependency path.
 *
 * @param {string} file path
 * @param {any} [breadcrumbs=[]] Used to keep track of cycling references, do not touch.
 * @return {Array} List of dependencies in the order they are found.
 * */
function analyze(file, opts, breadcrumbs) {
  var defaults = {
    ignoreMissing: true,
    ignoreCyclic: true
  };
  opts = Object.assign(defaults, opts);
  breadcrumbs = breadcrumbs || [];
  var result = [];
  file = path.resolve(file);
  if (breadcrumbs.indexOf(file) !== -1) {
    if (!opts.ignoreCyclic) {
      throw new Error('Cyclic dependency detected ' + JSON.stringify(breadcrumbs.concat(file)));
    }
    return [];
  }
  breadcrumbs.push(file);
  var text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT' && opts.ignoreMissing) {
      // swallow
      return [];
    }
    throw err;
  }
  var deps = parseDeps(text);

  for (var dep of deps) {
    if (dep[0] === '.') {
      dep = normalize(dep);
      var child = path.resolve(path.join(path.dirname(file), dep));
      result.push(child);
      result = result.concat(analyze(child, opts, breadcrumbs));
    } else {
      result.push(dep);
    }
  }
  breadcrumbs.pop();
  result = result.filter(unique);
  return result;
}

module.exports.analyze   = analyze;
module.exports.parseDeps = parseDeps;
module.exports.normalize = normalize;

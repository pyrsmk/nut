/*!
  * Ender: open module JavaScript framework (module-lib)
  * http://enderjs.com
  * License MIT
  */

var global = this

/**
 * @param  {string}  id   module id to load
 * @return {object}
 */
function require(id) {
  if ('$' + id in require._cache)
    return require._cache['$' + id]
  if ('$' + id in require._modules)
    return (require._cache['$' + id] = require._modules['$' + id]._load())
  if (id in window)
    return window[id]

  throw new Error('Requested module "' + id + '" has not been defined.')
}

/**
 * @param  {string}  id       module id to provide to require calls
 * @param  {object}  exports  the exports object to be returned
 */
function provide(id, exports) {
  return (require._cache['$' + id] = exports)
}

/**
 * @expose
 * @dict
 */
require._cache = {}

/**
 * @expose
 * @dict
 */
require._modules = {}

/**
 * @constructor
 * @param  {string}                                          id   module id for this module
 * @param  {function(Module, object, function(id), object)}  fn   module definition
 */
function Module(id, fn) {
  this.id = id
  this.fn = fn
  require._modules['$' + id] = this
}

/**
 * @expose
 * @param  {string}  id   module id to load from the local module context
 * @return {object}
 */
Module.prototype.require = function (id) {
  var parts, i

  if (id.charAt(0) == '.') {
    parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')

    while (~(i = parts.indexOf('.')))
      parts.splice(i, 1)

    while ((i = parts.lastIndexOf('..')) > 0)
      parts.splice(i - 1, 2)

    id = parts.join('/')
  }

  return require(id)
}

/**
 * @expose
 * @return {object}
 */
Module.prototype._load = function () {
  var m = this

  if (!m._loaded) {
    m._loaded = true

    /**
     * @expose
     */
    m.exports = {}
    m.fn.call(global, m, m.exports, function (id) { return m.require(id) }, global)
  }

  return m.exports
}

/**
 * @expose
 * @param  {string}                     id        main module id
 * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
 * @param  {string}                     main      the id of the main module
 */
Module.createPackage = function (id, modules, main) {
  var path, m

  for (path in modules) {
    new Module(id + '/' + path, modules[path])
    if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
  }

  if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
}

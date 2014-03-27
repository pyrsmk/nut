# Ender CommonJS
The core client library to Ender providing you with `require`, `provide`, and a `Module` class.

## `require(id)`
``` js
var each = require('underscore').each
var select = require('sizzle')
each(select('h1'), function (el) {
  el.style.color = 'red'
})
```

### `require._modules`
Includes the list of which modules are available for use in your Ender bundle

### `require._cache`
Includes the list of modules that have been `required()` by the implementer.

## `provide (id, value)`
``` js
provide('client/utils', {
  formatNumber: function (num) {
    return String(num).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
})

// access client/utils module
var format = require('client/utils').formatNumber
```

## `Module`
- supports multi-file modules, internal/relative requires, `index` requiring, requiring submodules, and CommonJS compatibility.

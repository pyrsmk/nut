nut 0.4.2
=========

Nut is a concise query selector engine that just allows you to do extremely simple queries.

Install
-------

You can pick the minified library or install it with :

```
jam install nut
bower install nut
npm install nut --save-dev
```

Quickly
-------

Hey, the [names](https://github.com/pyrsmk/nut/tree/names) branch supports `name` attributes! Thanks to [Crydust](https://github.com/Crydust) ;)

Oh jeez, another engine?!
-------------------------

Nut aims to be minimal to have a very tiny footprint and extreme velocity based on the observation that much of CSS requests could be kept as simple as possible since javascript is able to handle a lot of things. It is most of the time faster than `querySelectorAll` and then faster than all selector engines. Nut does not implement request caching, to avoid unecessary code additions and performance loss, because the user can easily keep a request and pass it as a context to another request.

Use
---

Here's it can handle :

```
#foo
section
.bar p
section #foo .bar p
div, #foo, .bar
```

And here's it can't :

```
div *
div#foo div.bar
div > p
div + p
```

So, all pseudo-classes, attribute selectors and other advanced syntax are not allowed. But, let's dig in it :

```javascript
// Return an array
nut('#foo');
```

Of course, queries can have a context :

```javascript
// Get nodes from the #foo context
nut('.bar p',nut('#foo')[0]);
```

And that's all you need to know ;)

Ender integration
-----------------

Nut is compatible with [ender](http://ender.jit.su) and supports some useful syntax.

Selecting nodes, as usually:

```javascript
$('#foo');
$('.bar p',$('#foo')[0]);
```

Selecting existing nodes:

```javascript
var nodes=$('.bar');
$(nodes);
```

License
-------

Nut is published under the [MIT license](http://dreamysource.mit-license.org).

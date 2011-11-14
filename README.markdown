Nut 0.1.17
==========

Nut is a concise query selector engine that just allows you to do extremely simple queries.

Oh jeez, another engine?!
-------------------------

Yeah, right, there's a lot of CSS selector engines, but just a few of them are really smalls.

First of all, nut is, most of the time, faster than `querySelectorAll` (take a look at the benchmark) and then faster than all selector engines. But please note that nut doesn't implement request caching (to avoid unecessary code additions and performance loss) because the user can easily keep a request and pass it as a context to another request. This is, nut aims to be minimal to have a very tiny footprint and extreme velocity based on the observation that much of CSS requests could be kept as simple as possible since javascript is able to handle a lot of things.

Nut is different from the other tiny engines, here's what they are:

- [QSA](https://github.com/cowboy/javascript-library-boilerplate) wraps `querySelectorAll`
- Svetlo (from [picoCSS](https://github.com/vladocar/picoCSS)) is also a wrapper around `querySelectorAll`
- [Quewery](https://github.com/danheberden/Quewery) handles ids, tags and `querySelectorAll` as fallback

But:

- `querySelectorAll` is not supported by all browsers, so supporting it with no fallback is inconsistent
- picoCSS uses `Array.prototype.slice.call` for casting `NodeList` objects as arrays, that is inconsistent too (but this framework doesn't seem to be made for cross-browser support, so I don't tell to throw a stone at it)
- QSA, picoCSS and Quewery don't support contexts

Then, nut tries to be fully reliable and as fast as possible by removing the most CSS syntax without becoming unhandy. There's another very interesting engine: [micro-selector](https://github.com/fabiomcosta/micro-selector). It supports another CSS syntax and is extensible.

Use
---

Here's it can handle:

    #foo
    section
    .bar p
    section #foo .bar p
    div,#foo,.bar
    div *

And here's it can't:

    div#foo div.bar
    div > p
    div + p

So, all pseudo-classes, attribute selectors and other advanced syntax are not allowed. But, let's dig in:

    // Return an array
    nut('#foo');

Of course, queries can have a context (an array, a NodeList, or a node):

    // Get nodes from the #foo context
    nut('.bar p',nut('#foo'));

And that's all you need to know ;)

Ender integration
-----------------

Nut is compatible with [ender](http://ender.no.de) and supports some useful syntax.

Selecting nodes, as usually:

    $('#foo');
    $('.bar p',$('#foo'));

Selecting existing nodes:

    var nodes=$('.bar');
    $(nodes);

Creating new elements:

    // elements var has 2 nodes
    var elements=$('<b>foo</b><i>bar</i>');

License
-------

Nut is published under the MIT license.

Nut 0.1.2
=========

Nut is a concise query selector engine that just allows you to do extremely simple queries. These queries only accept ids, classes and tags with optional hierarchy.

Here's it can handle:

    #foo
    section
    .bar p
    section #foo .bar p

And here's it can't:

    div#foo div.bar
    div#foo.bar
    div *
    div > p
    div + p

So, all pseudo-classes, attribute selectors and other advanced syntax are not allowed. Nut is __just__ an extreme minimal library that aims to be very light and quick, based on the observation that most selectors could be succinct (as javascript itself can handle a lot of things). It __doesn't__ replace a complete selector engine like [Sizzle](https://github.com/jquery/sizzle) or [qwery](https://github.com/ded/qwery).

But, let's dig in:

    // Return an array
    nut('#foo');

Of course, queries can have a context:

    // Get nodes from the #foo context
    nut('.bar p',nut('#foo'));

And that's all you need to know ;)
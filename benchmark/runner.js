domReady(function(){

    var suite=new Benchmark.Suite();

    // p
    suite.add('[querySelectorAll: p]',function(){
        document.querySelectorAll('p');
    })
    .add('[nut: p]',function(){
        nut('p');
    })

    // #foo
    .add('[querySelectorAll: #foo]',function(){
        document.querySelectorAll('#foo');
    })
    .add('[nut: #foo]',function(){
        nut('#foo');
    })

    // .bar from #foo context
    .add('[querySelectorAll: .bar from #foo context]',function(){
        var foo=document.querySelectorAll('#foo'),
            nodes=[],
            bar,i,
            j=foo.length,
            k,l;
        for(i=0;i<j;++i){
            bar=foo[i].querySelectorAll('.bar');
            l=bar.length;
            for(k=0;k<l;++k){
                nodes.push(bar[k]);
            }
        }
    })
    .add('[nut: .bar from #foo context]',function(){
        nut('.bar',nut('#foo'));
    })

    // #foo .bar span
    .add('[querySelectorAll: #foo .bar span]',function(){
        document.querySelectorAll('#foo .bar span');
    })
    .add('[nut: #foo .bar span]',function(){
        nut('#foo .bar span');
    })
    
    // #foo .bar * , p
    .add('[querySelectorAll: #foo .bar * , p]',function(){
        document.querySelectorAll('#foo .bar * , p');
    })
    .add('[nut: #foo .bar * , p]',function(){
        nut('#foo .bar * , p');
    })

    // Display results
    .on('complete',function(){
        var j=this.length;
        for(var i=0;i<j;++i){
            log(this[i].toString());
        }
    })

    // Run benchmarks
    .run();

});
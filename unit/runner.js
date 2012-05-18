domReady(function(){

    sink('nut',function(test,ok,before,after){
    
        // Verify nodes consistence
        var verifyNodes=function(nodes,length){
            if(nodes.length!=length){
                return false;
            }
            var i=nodes.length;
            while(i){
                if(typeof nodes[--i]!='object'){
                    return false;
                }
            }
            return true;
        };
        
        test('Acceptable selectors',9,function(){
            // p
            ok(verifyNodes(nut('p'),3),'p');
            // #foo
            ok(verifyNodes(nut('#foo'),1),'#foo');
            // .bar from #foo context (array)
            ok(verifyNodes(nut('.bar',nut('#foo')),2),'.bar from #foo context (array)');
            // .bar from #foo context (node)
            ok(verifyNodes(nut('.bar',nut('#foo')[0]),2),'.bar from #foo context (node)');
            // #foo .bar span
            ok(verifyNodes(nut('#foo .bar span'),2),'#foo .bar span');
            // [name="baz"]
            ok(verifyNodes(nut('[name="baz"]'),2),'[name="baz"]');
            // [name="baz"] from #foo context (array)
            ok(verifyNodes(nut('[name="baz"]',nut('#foo')),1),'[name="baz"] from #foo context (array)');
            // [name="baz"] from #foo context (node)
            ok(verifyNodes(nut('[name="baz"]',nut('#foo')[0]),1),'[name="baz"] from #foo context (node)');
            // #foo .bar span [name="baz"]
            ok(verifyNodes(nut('#foo .bar span [name="baz"]'),1),'#foo .bar span [name="baz"]');
        });

        test('Non acceptable selectors',1,function(){
            ok(nut('#foo > p').length===0,'#foo > p');
        });
        
        test('Doesn\'t exist',4,function(){
            ok(nut('foobar').length===0,'foobar');
            ok(nut('#foobar').length===0,'#foobar');
            ok(nut('.foobar').length===0,'.foobar');
            ok(nut('[name="foobar"]').length===0,'[name="foobar"]');
        });
        
        test('Ender integration',3,function(){
            ok(verifyNodes($('<b>foo</b><i>bar</i>'),2),'Create 2 elements');
            ok(verifyNodes($('.bar',$('#foo')),2),'Get elements from a specific context');
            ok(verifyNodes($($('#foo')),1),'Specify a node');
        });

    });

    start();

});

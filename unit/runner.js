domReady(function(){

    sink('nut',function(test,ok,before,after){

        test('Acceptable selectors',6,function(){
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
            // #foo .bar span,p
            ok(verifyNodes(nut(' #foo  .bar  span , p '),5),'#foo .bar span , p');
        });

        test('Non acceptable selectors',1,function(){
            ok(nut('#foo > p').length===0,'#foo > p');
        });

    });

    start();

});

domReady(function(){

    sink('nut',function(test,ok,before,after){

        test('Acceptable selectors',5,function(){
            // p
            var nodes=nut('p');
            ok(nodes.length==3 && (typeof nodes[0]=='object') && (typeof nodes[1]=='object') && (typeof nodes[2]=='object'),'p');
            // #foo
            nodes=nut('#foo');
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'#foo');
            // #foo .bar
            nodes=nut('.bar',nut('#foo'));
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'.bar from #foo context');
            // #foo .bar
            nodes=nut('.bar',nut('#foo')[0]);
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'.bar from #foo context');
            // #foo .bar span
            nodes=nut('#foo .bar span');
            ok(nodes.length==2 && (typeof nodes[0]=='object') && (typeof nodes[1]=='object'),'#foo .bar span');
        });

        test('Non acceptable selectors',1,function(){
            ok(nut('#foo > p').length===0,'#foo > p');
        });

    });

    start();

});

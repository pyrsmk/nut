domReady(function(){

    sink('nut',function(test,ok,before,after){

        test('Acceptable selectors',6,function(){
            // p
            var nodes=nut('p');
            ok(nodes.length==3 && (typeof nodes[0]=='object') && (typeof nodes[1]=='object') && (typeof nodes[2]=='object'),'p');
            // #foo
            nodes=nut('#foo');
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'#foo');
            // .bar from #foo context
            nodes=nut('.bar',nut('#foo'));
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'.bar from #foo context');
            // .bar from #foo context
            nodes=nut('.bar',nut('#foo')[0]);
            ok(nodes.length==1 && (typeof nodes[0]=='object'),'.bar from #foo context');
            // #foo .bar span
            nodes=nut('#foo .bar span');
            ok(nodes.length==2 && (typeof nodes[0]=='object') && (typeof nodes[1]=='object'),'#foo .bar span');
            // #foo span,table tr
            nodes=nut(' #foo span , table tr ');
            ok(nodes.length==4 && (typeof nodes[0]=='object') && (typeof nodes[1]=='object') && (typeof nodes[2]=='object') && (typeof nodes[3]=='object'),'#foo span,table tr');
        });

        test('Non acceptable selectors',1,function(){
            ok(nut('#foo > p').length===0,'#foo > p');
        });

    });

    start();

});

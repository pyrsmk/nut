// inspired from https://github.com/ded/qwery/blob/master/src/ender.js

(function(){

    var nut=require('nut');

    $._select=function(selectors,contexts){
        // Nodes
        if(typeof selectors!='string'){
            return selectors;
        }
        // New element
        else if(selectors.match(/^\s*</)){
            var tag=selectors.match(/^\s*<\s*([a-z]+)/i)[1],
                table='table',
                nodeMap={
                    thead:      table,
                    tbody:      table,
                    tfoot:      table,
                    tr:         'tbody',
                    th:         'tr',
                    td:         'tr',
                    fieldset:   'form',
                    option:     'select'
                },
                root=document.createElement(nodeMap[tag] || 'div'),
                element,
                elements=[],
                i=-1;
            root.innerHTML=selectors;
            element=root.firstChild;
            do{
                element.nodeType==1 && elements.push(element);
            }
            while(element=element.nextSibling)
            return elements;
        }
        // Selectors
        else{
            return nut(selectors,contexts);
        }
    };

}());
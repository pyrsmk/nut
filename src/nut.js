/*
    nut, the concise CSS selector engine

    Version : 0.1.2
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/nut
    License : MIT

    TODO
        [ ] cache
        [ ] benchmark against qwery
        [/] lint
*/
this.nut=function(selectors,context){
    // No selectors or contains forbidden chars
    if(selectors.match(/^(\s*[#.]?\w+\s*)+$/)===null){
        return [];
    }
    // Init
    if(!context){
        context=[this.document];
    }
    if(context.length===undefined){
        context=[context];
    }
    var nodes;
    // Define a replacement getElementsByClassName function for IE<9
    var getNodesByClassName=function(name,context){
        // Init vars
        var nodes=[],
            j=context.childNodes.length,
            classname;
        // Browe children
        for(var i=0;i<j;++i){
            if(classname=context.childNodes[i].className){
                // Match the class
                if(classname.match(new RegExp('(^|\s+)'+name+'($|\s+)'))){
                    nodes.push(context.childNodes[i]);
                }
            }
            // Browse child children
            nodes=nodes.concat(getNodesByClassName(name,context.childNodes[i]));
        }
        return nodes;
    };
    // Browse context
    for(var i in context){
        // Try querySelectorAll method
        /*if(context[i].querySelectorAll){
            return context[i].querySelectorAll(selectors);
        }*/
        // Set context
        nodes=[context[i]];
        // Browse selectors
        selectors=selectors.split(/\s+/);
        for(var j in selectors){
            // Split selector
            var elements=[],
                nodelist,
                tokens=selectors[j].match(/^([#.])?(.+)/);
            // No tokens? Goodbye!
            if(!tokens){
                return [];
            }
            // Apply current selector to all current nodes
            for(var k in nodes){
                switch(tokens[1]){
                    // Get elements by class
                    case '.':
                        nodelist=nodes[k].getElementsByClassName?
                                 nodes[k].getElementsByClassName(tokens[2]):
                                 getNodesByClassName(tokens[2],nodes[k]);
                        break;
                    // Get elements by id
                    case '#':
                        nodelist=[this.document.getElementById(tokens[2])];
                        break;
                    // Get elements by tag
                    default:
                        nodelist=nodes[k].getElementsByTagName(tokens[2]);
                }
                // Append new elements
                var m=nodelist.length;
                for(var l=0;l<m;++l){
                    elements.push(nodelist[l]);
                }
            }
            // Update nodes
            nodes=elements;
        }
    }
    return nodes;
};
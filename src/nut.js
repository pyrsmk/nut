/*
    nut, the concise CSS selector engine

    Version : 0.1.1a
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/nut
    License : MIT

    TODO
        [ ] cache
        [/] unit testing
        [ ] benchmark against qwery
        [/] lint
*/
this.nut=function(selectors,context){
    // Format
    if(!context){
        context=[this.document];
    }
    if(!(context instanceof Array)){
        context=[context];
    }
    // No selectors? Goodbye!
    if(!selectors){
        return [];
    }
    // Init
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
        if(context[i].querySelectorAll && selectors.match(/^(\s*[#.]?\w+\s*)+$/)){
            return context[i].querySelectorAll(selectors);
        }
        // Set context
        nodes=[context[i]];
        // Browse selectors
        selectors=selectors.split(/\s+/);
        for(var j in selectors){
            // Split selector
            var elements=[];
            var tokens=selectors[j].match(/^([#.])?(.+)/);
            // No tokens? Goodbye!
            if(!tokens){
                return [];
            }
            // Apply current selector to all context
            for(var k in nodes){
                if(typeof nodes[k]=='object'){
                    switch(tokens[1]){
                        // Get elements by class
                        case '.':
                            elements=elements.concat(
                                nodes[k].getElementsByClassName?
                                nodes[k].getElementsByClassName(tokens[2]):
                                getNodesByClassName(tokens[2],nodes[k])
                            );
                            break;
                        // Get elements by id
                        case '#':
                            elements=elements.concat([this.document.getElementById(tokens[2])]);
                            break;
                        // Get elements by tag
                        default:
                            elements=elements.concat(nodes[k].getElementsByTagName(tokens[2]));
                    }
                }
            }
            // Add the new node ones
            nodes=elements;
        }
    }
    return nodes;
};
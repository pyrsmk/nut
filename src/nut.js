/*
    nut, the extreme minimal CSS selector engine

    Version : 0.1.0a
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/nut
    License : MIT

    TODO
        [ ] cache
        [ ] unit testing
        [ ] benchmark against qwery
        [/] querySelectorAll
*/
nut=function(selectors,context){
    // Format
    if(!context){
        context=document;
    }
    // No selectors? Goodbye!
    if(!selectors){
        return new Array;
    }
    // Try querySelectorAll method
    if(context.querySelectorAll && selectors.match(/[#.\w\s]/)){
        return Array.prototype.slice.call(context.querySelectorAll(selectors));
    }
    // Init vars
    var nodes=new Array(context),
        getNodesByClassName=function(name,context){
            // Init vars
            var nodes=new Array,
                j=context.childNodes.length;
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
    // Browse selectors
    selectors=selectors.split(/\s+/);
    for(var i in selectors){
        // Split selector
        var elements=new Array;
        var tokens=selectors[i].match(/^([#.])?(.+)/);
        // No tokens? Goodbye!
        if(!tokens){
            return new Array;
        }
        // Apply current selector to all context
        for(var j in nodes){
            if(typeof nodes[j]=='object'){
                switch(tokens[1]){
                    // Get elements by class
                    case '.':
                        elements=elements.concat(
                            nodes[j].getElementsByClassName?
                            Array.prototype.slice.call(nodes[j].getElementsByClassName(tokens[2])):
                            getNodesByClassName(tokens[2],nodes[j])
                        );
                        break;
                    // Get elements by id
                    case '#':
                        elements=elements.concat(new Array(document.getElementById(tokens[2])));
                        break;
                    // Get elements by tag
                    default:
                        elements=elements.concat(Array.prototype.slice.call(nodes[j].getElementsByTagName(tokens[2])));
                }
            }
        }
        // Add the new node ones
        nodes=elements;
    }
    return nodes;
};
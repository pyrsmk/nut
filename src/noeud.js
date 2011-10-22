/*
    Noeud, the minimal CSS selector engine

    Version : 0.1.0a
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/noeud
    License : MIT

    TODO
        [ ] cache
        [ ] unit testing
        [ ] benchmark against qwery
*/
noeud=function(selectors,context){
    // Format
    if(!context){
        context=document;
    }
    // No selectors? Goodbye!
    if(!selectors){
        return new Array;
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
        },
        pieces,
        elements;
    // Browse selectors
    selectors=selectors.split(/\s+/);
    for(var i in selectors){
        // Get nodes for that selector
        pieces=selectors[i].match(/^([#.])?(.*)/);
        elements=new Array();
        for(var j in nodes){
            if(typeof nodes[j]=='object'){
                switch(pieces[1]){
                    // Get elements by class
                    case '.':
                        elements=elements.concat(
                            !nodes[j].getElementsByClassName?
                            Array.prototype.slice.call(nodes[j].getElementsByClassName(pieces[2])):
                            getNodesByClassName(pieces[2],nodes[j])
                        );
                        break;
                    // Get elements by id
                    case '#':
                        elements=elements.concat(new Array(document.getElementById(pieces[2])));
                        break;
                    // Get elements by tag
                    default:
                        elements=elements.concat(Array.prototype.slice.call(nodes[j].getElementsByTagName(pieces[2])));
                }
            }
        }
        // Add the new node ones
        nodes=elements;
    }
    return nodes;
};
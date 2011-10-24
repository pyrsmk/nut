/*
    nut, the concise CSS selector engine

    Version : 0.1.3
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/nut
    License : MIT

    TODO
        [/] lint
        [ ] #foo,div syntax
*/

(function(window,document){

    /*
        Select DOM nodes

        Parameters
            string selectors        : CSS selectors
            array, object contexts  : context nodes

        Return
            array                   : found nodes
    */
    window.nut=function(selectors,contexts){
        // No selectors or contains forbidden chars
        if(!selectors.match(/^[#.\w\s]+$/)){
            return [];
        }
        // Format
        if(!contexts){
            contexts=[this.document];
        }
        if(contexts.length===undefined){
            contexts=[contexts];
        }
        // Init vars
        var nodes=[],
            elements,
            nodelist,
            node,
            re_selectors=/\s+/,
            re_tokens=/^([#.])?(.+)/,
            tokens,
            i=0,
            j,k,l;
        // Browse contexts
        while(context=contexts[i++]){
            // Set context
            nodes.push(context);
            // Browse selectors
            selectors=selectors.split(re_selectors);
            j=0;
            while(selector=selectors[j++]){
                // Split selector
                tokens=selector.match(re_tokens);
                // No tokens? Goodbye!
                if(!tokens){
                    return [];
                }
                // Apply current selector to all current nodes
                elements=[];
                k=0;
                while(node=nodes[k++]){
                    switch(tokens[1]){
                        // Get elements by class
                        case '.':
                            nodelist=node.getElementsByClassName?
                                     node.getElementsByClassName(tokens[2]):
                                     getNodesByClassName(tokens[2],node);
                            break;
                        // Get elements by id
                        case '#':
                            nodelist=[document.getElementById(tokens[2])];
                            break;
                        // Get elements by tag
                        default:
                            nodelist=node.getElementsByTagName(tokens[2]);
                    }
                    // Push new elements
                    l=0;
                    while(node=nodelist[l++]){
                        elements.push(node);
                    }
                }
                // Update nodes
                nodes=elements;
            }
        }
        return nodes;
    };

    /*
        Define a getElementsByClassName replacement function for IE<9

        Parameters
            string name     : class name
            object context  : context node

        Return
            array           : found nodes
    */
    function getNodesByClassName(name,context){
        // Init vars
        var nodes=[],
            j=context.childNodes.length,
            classname;
        // Browse children
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

})(this,this.document);
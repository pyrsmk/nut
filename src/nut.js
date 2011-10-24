/*
    nut, the concise CSS selector engine

    Version : 0.4
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/nut
    License : MIT
*/

(function(window,document){

    /*
        Get nodes corresponding to a class name (for IE<9)

        Parameters
            string name     : class name
            object context  : contextual node

        Return
            array           : found nodes
    */
    function getNodesByClassName(name,context){
        // Init vars
        var nodes=[],
            child,
            i=-1;
        // Browse children
        while(child=context.childNodes[++i]){
            // Match the class
            if(child.className && child.className.match('\\b'+name+'\\b')){
                nodes.push(child);
            }
            // Get nodes from child's children
            nodes=nodes.concat(getNodesByClassName(name,child));
        }
        return nodes;
    }

    /*
        Select DOM nodes

        Parameters
            string expressions      : CSS selectors
            array, object contexts  : contextual nodes

        Return
            array                   : found nodes
    */
    window.nut=function(expressions,contexts){
        // Format
        expressions=expressions.split(',');
        if(!contexts){
            contexts=[this.document];
        }
        if(contexts.length===undefined){
            contexts=[contexts];
        }
        // Init vars
        var nodes=[],
            context,
            expression,
            local_context,
            local_contexts,
            future_local_contexts,
            selector,
            selectors,
            tokens,
            elements,
            element,
            i=-1,
            j,k,l,m;
        // Evaluate expressions for each global context
        while(context=contexts[++i]){
            j=-1;
            while(expression=expressions[++j]){
                // Init local context
                local_contexts=[context];
                // Evaluate expression
                selectors=expression.split(/\s+/);
                k=-1;
                while((selector=selectors[++k])!==undefined){
                    // Drop empty selectors
                    if(!selector){
                        continue;
                    }
                    // Tokenize current selector
                    tokens=selector.match(/^([#.])?(.+)/);
                    // Evaluate current selector for each local context
                    future_local_contexts=[];
                    l=-1;
                    while(local_context=local_contexts[++l]){
                        switch(tokens[1]){
                            // Get elements by class
                            case '.':
                                if(local_context.getElementsByClassName){
                                    elements=local_context.getElementsByClassName(tokens[2]);
                                }
                                else{
                                    elements=getNodesByClassName(tokens[2],local_context);
                                }
                                break;
                            // Get elements by id
                            case '#':
                                elements=[document.getElementById(tokens[2])];
                                break;
                            // Get elements by tag
                            default:
                                elements=local_context.getElementsByTagName(tokens[2]);
                        }
                        // Add new nodes to the future local context list
                        m=-1;
                        while(element=elements[++m]){
                            future_local_contexts.push(element);
                        }
                    }
                    // Set new local contexts
                    local_contexts=future_local_contexts;
                }
                // Append new nodes
                nodes=nodes.concat(local_contexts);
            }
        }
        return nodes;
    };

})(this,this.document);
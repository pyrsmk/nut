/*
    nut, the concise CSS selector engine

    Version : 0.1.5
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
        Get nodes from an id selector
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    function getNodesFromIdSelector(selector,context){
        return [document.getElementById(selector)];
    }
    
    /*
        Get nodes from a class selector
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    function getNodesFromClassSelector(selector,context){
        if(context.getElementsByClassName){
            return context.getElementsByClassName(selector);
        }
        else{
            return getNodesByClassName(selector,context);
        }
    }
    
    /*
        Get nodes from a tag selector
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    function getNodesFromTagSelector(selector,context){
        return context.getElementsByTagName(selector);
    }
    
    /*
        Select DOM nodes

        Parameters
            string selectors        : CSS selectors
            array, object contexts  : contextual nodes

        Return
            array                   : found nodes
    */
    window.nut=function(selectors,contexts){
        // Format
        selectors=selectors.split(/\s+/);
        if(!contexts){
            contexts=[document];
        }
        else if(contexts.length===undefined){
            contexts=[contexts];
        }
        // Init vars
        var nodes=[],
            local_contexts,
            future_local_contexts,
            selector,
            elements,
            i=contexts.length,
            j,k,l,m,
            getNodesFromSelector;
        // Evaluate expressions for each global context
        while(i){
            // Init local context
            local_contexts=[contexts[--i]];
            // Evaluate selectors
            j=-1;
            k=selectors.length;
            while(++j<k){
                // Drop empty selectors
                if(selector=selectors[j]){
                    // Id selector
                    if(selector[0]=='#'){
                        selector=selector.substr(1);
                        getNodesFromSelector=getNodesFromIdSelector;
                    }
                    // Class selector
                    else if(selector[0]=='.'){
                        selector=selector.substr(1);
                        getNodesFromSelector=getNodesFromClassSelector;
                    }
                    // Tag selector
                    else{
                        getNodesFromSelector=getNodesFromTagSelector;
                    }
                    // Evaluate current selector for each local context
                    future_local_contexts=[];
                    l=local_contexts.length;
                    while(l){
                        elements=getNodesFromSelector(selector,local_contexts[--l]);
                        m=elements.length;
                        while(m){
                            future_local_contexts.push(elements[--m]);
                        }
                    }
                    // Set new local contexts
                    local_contexts=future_local_contexts;
                }
            }
            // Append new nodes
            nodes=nodes.concat(local_contexts);
        }
        return nodes;
    };

})(this,this.document);
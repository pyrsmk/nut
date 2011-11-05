/*
    nut, the concise CSS selector engine

    Version:    0.1.9
    Author:     Aurélien Delogu (dev@dreamysource.fr)
    Homepage:   https://github.com/pyrsmk/nut
    License:    MIT
*/

(function(name,obj){
    if(typeof module!='undefined'){
        module.exports=obj;
    }
    else{
        this[name]=obj;
    }
}('nut',function(){
    
    /*
        Get all nodes
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    function getAllNodes(selector,context){
        var node=context.firstChild,
            nodes=[];
        // Reduce
        if(node){
            do{
                if(node.nodeType==1){
                    nodes.push(node);
                }
            }
            while(node=node.nextSibling);
        }
        return nodes;
    }
    
    /*
        Get id node
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    function getNodeFromIdSelector(selector,context){
        return [document.getElementById(selector)];
    }
    
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
        var node=context.firstChild,
            nodes=[],
            elements;
        // Browse children
        if(node){
            do{
                if(node.nodeType==1){
                    // Match the class
                    if(node.className && node.className.match('\\b'+name+'\\b')){
                        nodes.push(node);
                    }
                    // Get nodes from node's children
                    if((elements=getNodesByClassName(name,node)).length){
                        nodes=nodes.concat(elements);
                    }
                }
            }
            while(node=node.nextSibling);
        }
        return nodes;
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
        if(!context.getElementsByClassName){
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
    return function(selectors,contexts){
        // Format contexts
        if(!contexts){
            contexts=[document];
        }
        else if(contexts.length===undefined){
            contexts=[contexts];
        }
        // Init vars
        var nodes=[],
            context,
            local_contexts,
            future_local_contexts,
            selector,
            elements,
            i=-1,
            j,k,l,m,n,o,
            getNodesFromSelector;
        // Prepare selectors
        selectors=selectors.split(',');
        n=-1;
        while(selector=selectors[++n]){
            selectors[n]=selector.split(/\s+/);
        }
        // Evaluate selectors for each global context
        while(context=contexts[++i]){
            j=selectors.length;
            while(j){
                // Init local context
                local_contexts=[context];
                // Evaluate selectors
                k=-1;
                l=selectors[--j].length;
                while(++k<l){
                    // Drop empty selectors
                    if(selector=selectors[j][k]){
                        // Id
                        if(selector[0]=='#'){
                            selector=selector.substr(1);
                            getNodesFromSelector=getNodeFromIdSelector;
                        }
                        // Class
                        else if(selector[0]=='.'){
                            selector=selector.substr(1);
                            getNodesFromSelector=getNodesFromClassSelector;
                        }
                        // Joker
                        else if(selector=='*'){
                            getNodesFromSelector=getAllNodes;
                        }
                        // Tag
                        else{
                            getNodesFromSelector=getNodesFromTagSelector;
                        }
                        // Evaluate current selector for each local context
                        future_local_contexts=[];
                        m=local_contexts.length;
                        while(m){
                            elements=getNodesFromSelector(selector,local_contexts[--m]);
                            n=-1;
                            o=elements.length;
                            while(++n<o){
                                future_local_contexts.push(elements[n]);
                            }
                        }
                        // Set new local contexts
                        local_contexts=future_local_contexts;
                    }
                }
                // Append new nodes
                nodes=nodes.concat(local_contexts);
            }
        }
        return nodes;
    };

}()));
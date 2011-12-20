/*
    nut, the concise CSS selector engine

    Version     : 0.1.20
    Author      : Aurélien Delogu (dev@dreamysource.fr)
    Homepage    : https://github.com/pyrsmk/nut
    License     : MIT
*/

(function(def){
    if(typeof module!='undefined'){
        module.exports=def;
    }
    else{
        this.nut=def;
    }
}(function(){
    
    var doc=document,
        firstChild='firstChild',
        nextSibling='nextSibling',
        getElementsByClassName='getElementsByClassName',
        length='length',
    
    /*
        Get id node
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    getNodesFromIdSelector=function(selector,context){
        var node=doc.getElementById(selector);
        if(!node){
            return [];
        }
        else{
            return [node];
        }
    },
    
    /*
        Get nodes corresponding to a class name (for IE<9)

        Parameters
            string name     : class name
            object context  : contextual node

        Return
            array           : found nodes
    */
    getNodesByClassName=function(name,context){
        // Init vars
        var node=context[firstChild],
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
                    if((elements=getNodesByClassName(name,node))[length]){
                        nodes=nodes.concat(elements);
                    }
                }
            }
            while(node=node[nextSibling]);
        }
        return nodes;
    },
    
    /*
        Get nodes from a class selector
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    getNodesFromClassSelector=function(selector,context){
        if(context[getElementsByClassName]){
            return context[getElementsByClassName](selector);
        }
        else{
            return getNodesByClassName(selector,context);
        }
    },
    
    /*
        Get nodes from a tag selector
        
        Parameters
            string selector : a selector
            context         : a context
        
        Return
            object          : nodes
    */
    getNodesFromTagSelector=function(selector,context){
        return context.getElementsByTagName(selector);
    };
    
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
            contexts=[doc];
        }
        else if(!contexts.pop){
            contexts=[contexts];
        }
        // Init vars
        var context,
            local_contexts,
            future_local_contexts,
            selector,
            elements,
            nodes=[],
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
            j=selectors[length];
            while(j){
                // Init local context
                local_contexts=[context];
                // Evaluate selectors
                k=-1;
                l=selectors[--j][length];
                while(++k<l){
                    // Drop empty selectors
                    if(selector=selectors[j][k]){
                        // Id
                        if(selector.charAt(0)=='#'){
                            selector=selector.substr(1);
                            getNodesFromSelector=getNodesFromIdSelector;
                        }
                        // Class
                        else if(selector.charAt(0)=='.'){
                            selector=selector.substr(1);
                            getNodesFromSelector=getNodesFromClassSelector;
                        }
                        // Tag
                        else{
                            getNodesFromSelector=getNodesFromTagSelector;
                        }
                        // Evaluate current selector for each local context
                        future_local_contexts=[];
                        m=-1;
                        while(local_contexts[++m]){
                            elements=getNodesFromSelector(selector,local_contexts[m]);
                            n=-1;
                            o=elements[length];
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

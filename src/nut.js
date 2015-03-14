/*! nut 0.4.2 (https://github.com/pyrsmk/nut) */

;(function(context,name,definition){
	if(typeof module!='undefined' && module.exports){
		module.exports=definition;
	}
	else if(typeof define=='function' && define.amd){
		define(definition);
	}
	else{
		context[name]=definition;
	}
}(this,'nut',function(){

	/*
		Get id node

		Parameters
			String selector : one selector
			Object context  : one context

		Return
			Array           : nodes
	*/
	var getNodesFromIdSelector=function(selector,context){
		var node=document.getElementById(selector);
		if(!node){
			return [];
		}
		else{
			return [node];
		}
	},

	/*
		Get nodes corresponding to one class name (for IE<9)

		Parameters
			String selector : one selector
			Object context  : one context

		Return
			Array           : nodes
	*/
	getNodesByClassName=function(name,context){
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
	},

	/*
		Get nodes from a class selector

		Parameters
			String selector : one selector
			Object context  : one context

		Return
			Array           : nodes
	*/
	getNodesFromClassSelector=function(selector,context){
		if(context.getElementsByClassName){
			return context.getElementsByClassName(selector);
		}
		else{
			return getNodesByClassName(selector,context);
		}
	},

	/*
		Get nodes from a tag selector

		Parameters
			String selector : one selector
			Object context  : one context

		Return
			Array           : nodes
	*/
	getNodesFromTagSelector=function(selector,context){
		return context.getElementsByTagName(selector);
	};

	/*
		Select DOM nodes

		Parameters
			String selectors : CSS selectors
			Object context   : contextual node

		Return
			Array            : found nodes
	*/
	return function(selectors,context){
		// Format
		if(!context){
			context=document;
		}
		// Init vars
		var local_contexts,
			future_local_contexts,
			selector,
			elements,
			nodes=[],
			j,k,l,m,n,o,
			getNodesFromSelector;
		// Prepare selectors
		selectors=selectors.split(',');
		n=-1;
		while(selector=selectors[++n]){
			selectors[n]=selector.split(/\s+/);
		}
		// Evaluate selectors for each global context
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
		return nodes;
	};

}()));

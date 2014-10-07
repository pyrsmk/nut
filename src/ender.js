$._select=function(selector,context){
	if(typeof selector=='object'){
		return selector;
	}
	else{
		if(context && context.length){
			context=context[0];
		}
		return require('nut')(selector,context);
	}
};
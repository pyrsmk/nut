$._select=function(selector,context){
	if(typeof selector=='object'){
		return selector;
	}
	else{
		return require('nut')(selector,context);
	}
};
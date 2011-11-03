var nut=require('nut');

$._select=function(selectors,contexts){
    // Selectors
    if(typeof selectors=='string'){
        return nut(selectors,contexts);
    }
    // Nodes
    else{
        return selectors;
    }
};
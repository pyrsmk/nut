/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build nut
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

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
                  node.nodeType==1 && nodes.push(node);
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

  provide("nut", module.exports);

  // inspired from https://github.com/ded/qwery/blob/master/src/ender.js
  
  (function(){
  
      var nut=require('nut');
  
      $._select=function(selectors,contexts){
          // New element
          if(selectors.match(/^\s*</)){
              var tag=selectors.match(/^\s*<\s*([a-z]+)/i)[1],
                  nodeMap={
                      thead:      'table',
                      tbody:      'table',
                      tfoot:      'table',
                      tr:         'tbody',
                      th:         'tr',
                      td:         'tr',
                      fieldset:   'form',
                      option:     'select'
                  },
                  root=document.createElement(nodeMap[tag] || 'div'),
                  element,
                  elements=[],
                  i=-1;
              root.innerHTML=selectors;
              element=root.firstChild;
              do{
                  element.nodeType==1 && elements.push(element);
              }
              while(element=element.nextSibling)
              return elements;
          }
          // Selectors
          else if(typeof selectors=='string'){
              return nut(selectors,contexts);
          }
          // Nodes
          else{
              return selectors;
          }
      };
  
  }());

}();
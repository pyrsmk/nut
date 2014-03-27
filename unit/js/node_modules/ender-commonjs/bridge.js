if (ender && ender.expose) {
  /*global global,require,provide,Module */
  ender.expose('global', global)
  ender.expose('require', require)
  ender.expose('provide', provide)
  ender.expose('Module', Module)
}

// https://github.com/kriasoft/react-static-boilerplate

import React, { Component } from 'react';

export default class Router {

  constructor (...comps) {
    this._factories = []
    this._navMeta = []

    for (let mods of comps) {
  //   console.log ('import mods : ' + mods);
      if (typeof mods === "function" ) {
        //if (mods.navProps) {
          console.log ('Router: creating factory : ' + mods.name.toLowerCase());
          this._factories[mods.name.toLowerCase()] = React.createFactory(mods);
          this._navMeta.push (mods.navProps);
        //}
      }
    }
  }

  getComponent(path) {
    let rootpath = 'landing'

    console.log (`Router getComponent: ${JSON.stringify(path)}`)
    if (path) {
      let rootpath_mtch = path.hash.match(/#\/([^\/?]*)/)
          
      if (rootpath_mtch && rootpath_mtch.length == 2 &&  rootpath_mtch[1].length >0) {
        rootpath = rootpath_mtch[1].toLowerCase()
        console.log (`Router getComponent: rootpath ${rootpath}`)
      }
    }

    // TODO path.search & path.hash
    let cf = this._factories[rootpath]
    if (cf) {
      return cf
    }
  }

}


import React, { Component } from 'react';
//import logo from './styles/logo.svg';
import './styles/App.css';

import {NavBar} from './components/page.jsx'
import {Landing} from './components/landing.jsx'
import {AMSAdmin} from './components/amsadmin.jsx'

import ServerState from './service/server.js'
import Router from './service/router.js'

import createHistory from 'history/createBrowserHistory'
const history = createHistory({
    basename: '',             // The base URL of the app (see below)
    hashType: 'slash'
})


class App extends Component {
    constructor (props) {
        super(props);
        console.log ('App: constructor');
        this._router = new Router(Landing, AMSAdmin);
        this._serverState = new ServerState();
        this.state = { booted: false, booterr: false,  bootmsg: "not booted", user: null, currentApp: null};
  }



  componentWillMount() {
    this._serverState.loadApp().then ((init) => {
        console.log (JSON.stringify (init))
        this._unlisten = history.listen((location) => {
            console.log (`got change URL ${JSON.stringify(location)}`)
            this.setState({url: location})
        }); // render subsequent URLs

        this.setState({url: history.location, user: this._serverState.user})
    })
  }

  componentWillUnmount() {
    if (this._unlisten) {
        this._unlisten()
    }
  }

  render() {
    let cf = this._router.getComponent(this.state.url);  
    return (
     <div>
        <NavBar user={this.state.user}/>
        {
            cf({prop: 'val'})
        }
      </div>
    );
  }
}

export default App;

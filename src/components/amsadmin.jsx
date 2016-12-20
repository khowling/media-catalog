import React, { Component } from 'react';


import ServerState from '../service/server.js';

export const AMSAdmin = ({}) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-24">
          <AMSTable things="Locators" cols={['d:Id', 'd:Path']}/>
        </div>
     </div>
     <section className="section">
      <header className="section-header row">
        <h1 className="section-title col-xs-24">
          Assets
        </h1>
      </header>
      <div className="row">
        <div className="col-xs-12">
          <AMSTableExp things="Assets" cols={['d:Id', 'd:Name']}/>
        </div>
        <div className="col-xs-12">
          <h4>Form</h4>
          <MetaForm/>
        </div>
      </div>
    </section>
    </div>
  )
}




class AMSTable extends Component {
  constructor (props) {
    super(props);
    this.state = {things: []}
}

  componentWillMount() {
    ServerState.instance._callServer(`/api/ams/${this.props.things}`).then ((as) => {
        this.setState ({things: as})
    })
  }

  render() {
  let [col1, col2] = this.props.cols
  return (
      <section className="section">
        <header className="section-header row">
          <h1 className="section-title col-xs-24">
            {this.props.things}
          </h1>
        </header>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{col1}</th>
                <th>{col2}</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              { this.state.things.map((a, i) => { 
                console.log (JSON.stringify(i))
                return (
                <tr key={'a'+i}>
                  <td>{a.content['0']['m:properties']['0'][col1]['0']}</td>
                  <td>{a.content['0']['m:properties']['0'][col2]['0']}</td>
                  <td className="text-right">{a.updated['0']}</td>
                </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </section>
  )
  }
}


class AMSTableExp extends Component {
  constructor (props) {
    super(props);
    this.state = {things: []}
}

  componentWillMount() {
    ServerState.instance._callServer(`/api/ams/${this.props.things}`).then ((as) => {
        this.setState ({things: as, active: 0})
    })
  }

  _expand(line) {
    this.setState ({ active: line})
  }

  render() {
  let [col1, col2] = this.props.cols
  return (

        <div className="entity-list entity-list-expandable">
          
              { this.state.things.map((a, i) => { 
                console.log (JSON.stringify(i))
                return (
                  <div key={'a'+i} className={`entity-list-item ${this.state.active === i ? 'active' : ''}`} onClick={this._expand.bind(this, i)}>
                        <div className="item-icon">
                            <span className="glyph glyph-mail"></span>
                        </div>
                        <div className="item-content-secondary">
                            <div className="content-text-primary">25.3 MB</div>
                            <div className="content-text-secondary">{a.updated['0']}</div>
                        </div>
                        <div className="item-content-primary">
                            <div className="content-text-primary">{a.content['0']['m:properties']['0'][col1]['0']}</div>
                            <div className="content-text-secondary">{a.content['0']['m:properties']['0'][col2]['0']}</div>
                            { false && 
                            <div className="progress">
                                <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{"width": "60%"}}>
                                    <span className="sr-only">60%</span>
                                </div>
                            </div>
                            }
                        </div>
                        <div className="item-content-expanded">
                            <button className="btn btn-default" disabled="disabled">Uninstall</button>
                            <button className="btn btn-default">Move</button>
                        </div>
                    </div>
                
                )}
              )}

        </div>
    )
  }
}


class MetaForm extends Component {
  constructor (props) {
    super(props);
    this.state = {things: []}
}

  componentWillMount() {
  //  ServerState.instance._callServer(`/api/ams/${this.props.things}`).then ((as) => {
  //      this.setState ({things: as})
  //  })
  }
  _callserver() {
      var that = this,
          client = new XMLHttpRequest();

      client.open('post', 'https://apitestvub.azurewebsites.net/json');
      //client.open('post', 'https://apitestvub.azureedge.net/json');
      client.withCredentials = true;
      client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      client.send();
      client.onload = function () {
         if (this.status === 200) {
           // Performs the function "resolve" when this.status is equal to 200
           //console.log ('got records : ' + this.response);
           that.setState({cors: this.response});
         } else {
           // Performs the function "reject" when this.status is different than 200
           that.setState({cors: this.response});
         }
      };
      client.onerror = function (e) {
        that.setState({cors: "Network Error: " + this.statusText});
      };
  }


  render() {
    return (
    <form className="theme-dark color-fill-accent-vivid-high" style={{"padding": "1em"}}>
        <div className="form-group">
            <label>Text</label>
            <input type='text' className='form-control'/>
        </div>
        <div className="form-group">
            <label className="disabled">Text</label>
            <input type='text' className='form-control' value="Disabled value" disabled="disabled" />
        </div>
        <div className="form-group">
            <label>Text Area</label>
            <textarea className='form-control'></textarea>
        </div>

        <button onClick={this._callserver.bind(this)}>cors</button>
        {this.state.cors}
    </form>
    )
  }
}
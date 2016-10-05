import React, { Component } from 'react';


import ServerState from '../service/server.js';

export const AMSAdmin = ({}) => {
  return (
    <div className="container">
      <AMSTable things="Locators" cols={['d:Id', 'd:Path']}/>
      <AMSTable things="Assets" cols={['d:Id', 'd:Name']}/>
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
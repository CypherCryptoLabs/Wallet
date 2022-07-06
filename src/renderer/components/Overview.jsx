import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Overview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {balance: 0}
        this.syncToNetwork = this.syncToNetwork.bind(this)
    }

    async componentDidMount() {
        this.syncToNetwork()
        //this.setState({balance: await window.electron.ipcRenderer.getBalance()});
    }

    async syncToNetwork() {
        await window.electron.ipcRenderer.syncToNetwork();
        this.setState({balance: await window.electron.ipcRenderer.getBalance()});
    }

    render() {
        return (
            <div>
              <h1>Balance:</h1>
              <h2>{this.state.balance} Cypher</h2>
              <Link to="/receive">Receive</Link>
              <Link to="/send">Send</Link><br />
              <button onClick={this.syncToNetwork}>Sync to Network</button>
            </div>
          );
    }
}
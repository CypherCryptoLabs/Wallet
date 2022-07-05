import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Overview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {balance: 0}
    }

    async componentDidMount() {
        console.log(await window.electron.ipcRenderer.getBalance())
        this.setState({balance: await window.electron.ipcRenderer.getBalance()});
    }

    render() {
        return (
            <div>
              <h1>Balance:</h1>
              <h2>{this.state.balance} Cypher</h2>
              <Link to="/receive">Receive</Link>
              <Link to="/send">Send</Link>
            </div>
          );
    }
}
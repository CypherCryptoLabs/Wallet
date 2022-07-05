import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Receive extends React.Component {
    constructor(props) {
        super(props)
        this.state = {address: 0}
    }

    async componentDidMount() {
        this.setState({address: await window.electron.ipcRenderer.getBlockchainAddress()});
    }

    render() {
        return (
          <div>
            <h1>Receive Cypher</h1>
            <Link to="../">Back</Link>
            <input value={this.state.address} readOnly></input>
          </div>
        );
    }
}
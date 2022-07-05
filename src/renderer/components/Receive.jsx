/*import { Link } from 'react-router-dom';

function Receive() {
    return (
      <div>
        <Link to="../">Back</Link>
        <input value="123"></input>
      </div>
    );
};

export default Receive;*/

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
            <Link to="../">Back</Link>
            <input value={this.state.address}></input>
          </div>
        );
    }
}
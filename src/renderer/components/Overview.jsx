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
      //<button onClick={this.syncToNetwork}>Sync to Network</button>

        return (
          <div className='bg-black min-h-screen min-w-screen text-white font-black'>
              <h1 className='text-4xl text-gradient m-auto pt-10'>Balance:</h1>
              <h2 className='m-auto text-2xl'>{this.state.balance} Cypher</h2>
              <div className='m-auto flex flex-wrapt space-x-10 mt-10'>
                <Link to="/receive" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Receive</Link>
                <Link to="/send" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Send</Link><br />
              </div>
            </div>
          );
    }
}

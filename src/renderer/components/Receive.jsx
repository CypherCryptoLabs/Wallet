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
          <div className='bg-black min-h-screen min-w-screen text-white font-black'>
            <Link to="../" className='text-xl bg-secondary p-0 pl-[2px] leading-9 rounded-full w-9 h-9 text-center hover:scale-110 duration-300 mt-4 right-3 absolute'>X</Link>
            <h1 className='text-4xl text-gradient m-auto pt-10'>Receive Cypher</h1>
            <p className='m-auto mt-4'>Your Address is the following:</p>
            <input className='block m-auto bg-secondary rounded-xl h-10 text-center mt-2 w-4/5' value={this.state.address} readOnly></input>
          </div>
        );
    }
}
import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Settings extends React.Component {

    constructor() {
        super();
        this.state = {address:"", port:-1};
        this.onChange =this.onChange.bind(this)
        this.sendUpdateSettings =this.sendUpdateSettings.bind(this)
    }

    async componentDidMount() {
        await this.sendLoadSettings();
    }

    async onChange(e){
        this.setState({ [e.target.name] : e.target.value });
    }

    async sendLoadSettings() {
        this.setState(await window.electron.ipcRenderer.loadSettings());
    }

    async sendUpdateSettings() {
        console.log(this.state);
        window.electron.ipcRenderer.updateSettings(this.state);
    }

    async sendDeleteCache() {
        window.electron.ipcRenderer.deleteCahe();
    }
  
    render() {
        return(
            <div className='bg-black min-h-screen min-w-screen text-white font-black'>
                <Link to="../" className='text-xl bg-secondary p-0 pl-[2px] leading-9 rounded-full w-9 h-9 text-center hover:scale-110 duration-300 mt-4 right-3 absolute'>X</Link>
                <h1 className='text-4xl text-gradient pt-10 m-auto'>Node Address & Port:</h1>
                <div className='m-auto'>
                    <input className='m-auto bg-secondary rounded-xl h-10 text-center mt-4 w-44' placeholder="Address" name='address' onChange={this.onChange} value={this.state.address}></input><p className='inline'>:</p>
                    <input className='m-auto bg-secondary rounded-xl h-10 text-center mt-4 w-16' placeholder="Port" type="number" step="0.001" name='port' onChange={this.onChange} min="0" max="65535" value={this.state.port}></input><br />
                    <button className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 m-auto mt-5 block' onClick={this.sendUpdateSettings}>Save</button>
                </div>
                <h1 className='text-4xl text-gradient pt-10 m-auto'>Cache:</h1>
                <div className='m-auto'>
                    <button className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 m-auto mt-5 block' onClick={this.sendDeleteCache}>Delete Cache</button>
                </div>
          </div>
        )
    }
}
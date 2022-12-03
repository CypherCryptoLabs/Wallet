import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { TransactionHistory } from './TransactionHistory.jsx'
import { Menu } from './Menu';
import catImage from "./../../assets/Spucki.jpg";

export class Overview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          balance: 0,
          error: false,
          clicks: 0
        }
        this.syncToNetwork = this.syncToNetwork.bind(this)
        this.easterEgg = this.easterEgg.bind(this);
    }

    async componentDidMount() {
        await this.syncToNetwork()
        //this.setState({balance: await window.electron.ipcRenderer.getBalance()});
    }

    async syncToNetwork() {
      try {
        await window.electron.ipcRenderer.syncToNetwork();
        this.setState({balance: await window.electron.ipcRenderer.getBalance()});
      } catch (error) {
        console.log(error);
        this.setState({balance: await window.electron.ipcRenderer.getBalance(), error: true});
      }
    }

    async easterEgg() {
      this.setState({clicks: this.state.clicks + 1})
    }

    render() {
      //<button onClick={this.syncToNetwork}>Sync to Network</button>

        return (
          <>
            
            <div className='bg-black min-h-screen min-w-screen text-white font-black'>
              { this.state.clicks < 5 &&
                <>
                <button className='text-xl bg-secondary p-0 px-2 leading-9 rounded-full h-9 text-center hover:scale-110 duration-300 mt-4 right-[120px] absolute' onClick={this.syncToNetwork}>Sync</button>
                <Link to="/settings" className='text-xl bg-secondary p-0 px-2 leading-9 rounded-full h-9 text-center hover:scale-110 duration-300 mt-4 right-3 absolute'>Settings</Link>
                <h1 className='text-4xl text-gradient m-auto pt-10' onClick={this.easterEgg}>Balance:</h1>
                <h2 className='m-auto text-2xl'>{this.state.balance} Cypher</h2>
                <div className='m-auto flex flex-wrapt space-x-10 mt-10'>
                  <Link to="/receive" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Receive</Link>
                  <Link to="/send" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Send</Link><br />
                </div>
                {
                  this.state.error == true &&
                  <p className='text-center mt-4 border-2 border-red-800 rounded-xl w-9/12 m-auto bg-red-800/20'>Your wallet could not be synced!</p>
                }
                <TransactionHistory></TransactionHistory>
                </>
              }
              {this.state.clicks >= 5 &&
                <div className="min-h-screen min-w-screen" style={{"backgroundImage": "url(" + catImage + ")", "backgroundSize": "contain"}} >
                  <h2 className='m-auto text-2xl mb-5 pt-[95%] text-center'>Rest in Peace Spooky/Spucki. You were the best friend I could have ever wished for. †1.12.2022</h2>
                </div>
              }
            </div>
            <Menu></Menu>
          </>
        );
    }
}

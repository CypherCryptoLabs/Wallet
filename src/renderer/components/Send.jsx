import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Send extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.sendTransaction = this.sendTransaction.bind(this)
        this.state = {
          networkFee: 0,
          amount: 0,
          receiver: "",
          remainingBalance: 0,
          transactionSuccess: undefined
        }
    }

    async onChange(e){
      this.setState({ [e.target.name] : e.target.value });
      this.setState({remainingBalance: await window.electron.ipcRenderer.getBalance() - this.state.networkFee - this.state.amount});
    }

    async sendTransaction() {
      this.setState({transactionSuccess:await window.electron.ipcRenderer.sendTransaction([this.state.receiver, this.state.amount, this.state.networkFee])})
    }

    render() {
        return (
          <div className='bg-black min-h-screen min-w-screen text-white font-black'>
            <Link to="../" className='text-xl bg-secondary p-0 pl-[2px] leading-9 rounded-full w-9 h-9 text-center hover:scale-110 duration-300 mt-4 right-3 absolute'>X</Link>
            <h1 className='text-4xl text-gradient m-auto pt-10'>Send Cypher</h1>

            {this.state.transactionSuccess === true &&
              <p>Successfully sent</p>
            }

            {this.state.transactionSuccess === false &&
              <p>An Error occured while sending the Transaction</p>
            }

            {this.state.transactionSuccess === undefined &&
            <>
              <p className='m-auto mt-2'>Enter the recipients Details here:</p>
              <input className='block m-auto bg-secondary rounded-xl h-10 text-center mt-4' placeholder="Address" name='receiver' onChange={this.onChange}></input>
              <input className='block m-auto bg-secondary rounded-xl h-10 text-center mt-4' placeholder="Amount" type="number" step="0.001" name='amount' onChange={this.onChange} min="0"></input>
              <input className='block m-auto bg-secondary rounded-xl h-10 text-center mt-4' placeholder="Network Fee" type="number" step="0.001" name='networkFee' onChange={this.onChange} min="0"></input>
              {
                this.state.remainingBalance > 0 &&
                <button className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 m-auto mt-5 block' onClick={this.sendTransaction}>Send</button>
              }
              {
                this.state.remainingBalance < 0 &&
                <button className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 m-auto mt-5 block' onClick={this.sendTransaction} disabled>Send</button>
              }
              {this.state.networkFee != 0 && this.state.amount != 0 && this.state.receiver != "" && this.state.remainingBalance > 0 &&
                <p className='text-center mt-4 border-2 border-amber-400 rounded-xl w-9/12 m-auto bg-amber-400/20'>After this transaction, you will have a remaining Balance of {this.state.remainingBalance} Cypher.</p>
              }
              {
                this.state.remainingBalance < 0 &&
                <p className='text-center mt-4 border-2 border-red-800 rounded-xl w-9/12 m-auto bg-red-800/20'>Your wallet does not have sufficient funds!</p>
              }
            </>
            }
          </div>
        );
    }
}

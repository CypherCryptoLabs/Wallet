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
          transactionSuccess: undefined
        }
    }

    onChange(e){
      this.setState({ [e.target.name] : e.target.value });
    }

    async sendTransaction() {
      this.setState({transactionSuccess:await window.electron.ipcRenderer.sendTransaction([this.state.receiver, this.state.amount, this.state.networkFee])})
    }

    render() {
        return (
          <div className='bg-black min-h-screen min-w-screen text-white font-black'>
            <Link to="../" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 mt-4'>Back</Link>
            <h1 className='text-4xl text-gradient m-auto pt-4'>Send Cypher</h1>

            {this.state.transactionSuccess === true &&
              <p>Successfully sent</p>
            }

            {this.state.transactionSuccess === false &&
              <p>An Error occured while sending the Transaction</p>
            }

            {this.state.transactionSuccess === undefined &&
            <>
              <input placeholder="Address" name='receiver' onChange={this.onChange}></input>
              <input placeholder="Amount" type="number" step="0.001" name='amount' onChange={this.onChange} min="0"></input>
              <input placeholder="Network Fee" type="number" step="0.001" name='networkFee' onChange={this.onChange} min="0"></input>
              <button onClick={this.sendTransaction}>Send</button>
            </>
            }
          </div>
        );
    }
}

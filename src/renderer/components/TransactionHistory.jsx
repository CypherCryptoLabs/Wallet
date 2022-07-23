import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class TransactionHistory extends React.Component {
    constructor() {
        super();
        this.state = {transactions:[]};
    }

    async componentDidMount() {
        this.setState({transactions: await window.electron.ipcRenderer.getTransactionHistory()})
    }

    
    render() {
        let transactions = this.state.transactions;
        var transactionsDOM;
        console.log(transactions)

        return (
            <table className='bg-secondary px-3 py-2 rounded-xl w-[90%] m-auto mt-4 table-fixed border-separate border-spacing-[5px]'>
                {
                    transactions.length == 0 && <tr><th className='m-auto text-gray-600'>You havent made a transaction yet</th></tr>
                }
                {
                    transactions.length != 0 && 
                    <tr>
                        <th>Receiver</th>
                        <th>Sender</th>
                        <th>Amount</th>
                        <th>Network Fee</th>
                    </tr>
                }
                {
                    transactions.length != 0 && 
                    
                        transactions.map((val, key) => {
                            return (<tr key={key}>
                                <td className='max-w-[25%] overflow-hidden text-center'>{val.payload.blockchainReceiverAddress}</td>
                                <td className='max-w-[25%] overflow-hidden text-center'>{val.payload.blockchainSenderAddress}</td>
                                <td className='max-w-[25%] overflow-hidden text-center'>{val.payload.unitsToTransfer}</td>
                                <td className='max-w-[25%] overflow-hidden text-center'>{val.payload.networkFee}</td>
                            </tr>)
                        })
                    
                }
            </table>
        )
    }
}
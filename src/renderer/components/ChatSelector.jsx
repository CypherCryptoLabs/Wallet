import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class ChatSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {chats:[]}
    }

    async componentDidMount() {
        this.setState({chats: await window.electron.ipcRenderer.getChats()})
    }

    render() {
        let chats = this.state.chats
        return (
            <>
                {
                    Object.keys(chats).length == 0 &&
                    <div className='min-h-screen min-w-screen pt-60'>
                        <h2 className='m-auto text-2xl mb-5'>You havent sent a Message yet</h2>
                        <Link to="/messenger/create" className='text-xl bg-secondary px-3 py-2 leading-9 rounded-xl text-center hover:scale-110 duration-300 left-0 right-0 m-auto absolute'>Start chatting!</Link>
                    </div>
                }
                {
                    Object.keys(chats).length > 0 &&
                    <>
                        <Link to="/messenger/create" className='text-xl bg-secondary px-3 py-2 leading-9 rounded-xl text-center hover:scale-110 duration-300 left-0 right-0 m-auto absolute mt-2'>Add Contact</Link>
                        <div className='min-h-screen min-w-screen pt-20'>
                            
                            {
                                Object.keys(chats).map((key, val) => {
                                    return (<div key={val} className="bg-secondary rounded-xl max-w-[90%] overflow-hidden m-auto h-20 flex flex-wrapt mb-4">
                                        <img src='https://cyphercrypto.io/resources/img/cypher-coin.svg' className='max-h-[80%] m-auto ml-2'/>
                                        <div className='mt-2'>
                                            <p className='truncate block overflow-hidden ml-5 max-w-[60%] min-w-[60%]'>{key}</p>
                                            <p className='truncate block overflow-hidden ml-5 max-w-[60%] min-w-[60%] text-gray-600 mt-2'>{val[0]} Test</p>
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    </>
                }
            </>
        );
    }
}
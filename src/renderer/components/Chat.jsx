import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { rejects } from 'assert';

export default function Chat(props) {
    // this is just a wrapper for the ChatComponent class
    const location = useLocation();
    console.log(location.state.key);
    return <div className='bg-black min-h-screen min-w-screen text-white font-black'><ChatComponent address={location.state.key} ></ChatComponent></div>
}

class ChatComponent extends React.Component {
    constructor(props) {
        super(props)
        this.address = props.address
        this.loadMessages = this.loadMessages.bind(this)
        this.timer = setInterval(this.loadMessages(), 100)
        this.state = {
            messages: [],
            address: ""
        }
    }

    async componentDidMount() {
        this.timer = setInterval(() => {this.loadMessages()}, 100)
        this.setState({address: await window.electron.ipcRenderer.getBlockchainAddress()});
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }
      

    async loadMessages() {
        this.setState({messages:await window.electron.ipcRenderer.getMessages(this.address)})
    }

    render() {
        let messages = []
        for(var i = 0; i < this.state.messages.length; i++) {
            let message = this.state.messages[i];
            if(message.sender == this.state.address) {
                messages.push(
                    <div className='bg-secondary rounded-xl p-2 ml-auto'>
                        <p>{message.message}</p>
                    </div>
                )
            } else {
                messages.push(
                    <div className='bg-sky-400 rounded-xl p-2 mr-auto'>
                        <p>{message.message}</p>
                    </div>
                )
            }
        }

        return (
            <>  
                <div className='h-10'>
                    <Link to="/messenger" className='text-xl bg-secondary p-0 px-3 leading-9 rounded-full h-9 text-center hover:scale-110 duration-300 mt-2 left-3 absolute'>&lt;</Link>
                </div>
                <div className='min-w-screen pl-2 pr-2 pt-2'>
                    {
                        messages
                    }
                </div>
                <textarea className='absolute bottom-[1%] left-[1%] w-[78%] bg-secondary rounded-xl h-10' type="textarea"/>
                <button className='absolute bottom-[1%] right-[1%] w-[18%] bg-secondary rounded-xl h-10'>Send</button>
            </>
        );
    }
}
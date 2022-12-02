import React from 'react';
import { render } from '@testing-library/react';
import { Link, useHistory } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export class CreateChat extends React.Component {
    constructor(props) {
        super(props)
        this.createChat = this.createChat.bind(this)
        this.onChange = this.onChange.bind(this)
        this.state = {receiver: "", redirect: false}
    }

    async componentDidMount() {
    }

    async onChange(e){
        this.setState({ [e.target.name] : e.target.value });
    }

    async createChat() {
        this.setState({transactionSuccess:await window.electron.ipcRenderer.createChat(this.state.receiver)})
        this.setState({redirect:true})
    }

    render() {
        return (
            <>
                {
                this.state.redirect == false &&
                <div className='bg-black min-h-screen min-w-screen text-white font-black pt-4'>
                    <input className='block m-auto bg-secondary rounded-xl h-10 text-center mt-60' placeholder="Address" name='receiver' onChange={this.onChange}></input>
                    <button className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300 m-auto mt-5 block' onClick={this.createChat}>Chat!</button>
                </div>
                }
                {this.state.redirect == true && <Navigate to="/messenger"></Navigate>}
            </>
        );
    }
}
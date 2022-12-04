import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

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
    }

    async componentDidMount() {
    }

    render() {
        return (
            <>  
                <div className='h-10'>
                    <Link to="/messenger" className='text-xl bg-secondary p-0 px-3 leading-9 rounded-full h-9 text-center hover:scale-110 duration-300 mt-2 left-3 absolute'>&lt;</Link>
                </div>
                <div className='min-w-screen'>

                </div>
                <textarea className='absolute bottom-[1%] left-[1%] w-[78%] bg-secondary rounded-xl h-10' type="textarea"/>
                <button className='absolute bottom-[1%] right-[1%] w-[18%] bg-secondary rounded-xl h-10'>Send</button>
            </>
        );
    }
}
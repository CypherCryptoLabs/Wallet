import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
    }

    render() {
        return (
            <div className='fixed bottom-4 inset-x-16 m-auto flex flex-wrapt space-x-10 mt-10 text-white'>
              <Link to="/" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Wallet</Link>
              <Link to="/messenger" className='text-xl bg-secondary px-3 py-2 rounded-xl w-40 text-center hover:scale-110 duration-300'>Messenger</Link>
            </div>
        );
    }
}
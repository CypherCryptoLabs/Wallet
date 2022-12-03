import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { Menu } from './Menu';
import { ChatSelector } from './ChatSelector';

export class Messenger extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
    }

    render() {
        return (
            <>
                <div className='bg-black min-h-screen min-w-screen text-white font-black pt-4'>
                    <ChatSelector></ChatSelector>
                </div>
                <Menu></Menu>
            </>
        );
    }
}
import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { Menu } from './Menu';

export class Messenger extends React.Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
    }

    render() {
        return (
            <Menu></Menu>
        );
    }
}
import React from 'react';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

export class Send extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
          <div>
            <Link to="../"> Back</Link>
            <input placeholder="Address"></input>
            <input placeholder="Amount"></input>
            <input placeholder="Network Fee"></input>
            <button>Send</button>
          </div>
        );
    }
}
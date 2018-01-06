import React from 'react';
import Logo from '../style/logo';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render(props) {
        console.log('INSIDE WELCOME');

        return (
            <div className="welcome-div">
                <div className='big-logo'>
                    <Logo />
                </div>
                <div className='massive-title'>
                    <h1>A SOCIAL NETWORK FOR HOLIDAY LOVERS.</h1>
                </div>
                <div className='login'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

//offline users

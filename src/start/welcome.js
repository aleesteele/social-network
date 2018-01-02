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
                <div className='big-title'>
                    <Logo />
                </div>
                <div className='massive-title'>
                    <h1>Have you bought Christmas gifts yet?
                    Neither have we.
                    Join the club.
                    </h1>
                </div>
                <div className='big-title'>
                    {this.props.children}
                </div>
                <div className="video-background">
                    <div className="video-foreground">
                        <iframe src="https://www.youtube.com/embed/yamiiGk6aSs?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        )
    }
}

//offline users

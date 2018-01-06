import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <center>
                <br/><br/><br/>
                <div>
                    <h1 className="home">Have you gotten your Christmas gifts?</h1>
                    <h2 className="home">Because there are 0 days left!</h2>
                </div>
            </center>
        )
    }
}

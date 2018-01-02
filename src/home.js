import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <center>
                <div>
                    <h1>DAYS UNTIL CHRISTMAS: <b>9</b><br /></h1><br />

                    <h1>Seriously, don't forget to buy them.</h1>
                </div><br/><br/><br/><br/>
                <p>santa by Benjamin Zanatta from the Noun Project</p>
            </center>
        )
    }
}

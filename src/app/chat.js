import React from 'react';
import { socket } from '../socket';

export default class Chat extends React.Component {
    componentDidMount() {

    }
    handleChange(e) {
        e.preventDefault();
        this.setState({
            message : e.target.value
        })
    }
    handleClick(e) {
        socket().emit('chatMessage', {
            message: this.message
        });
    }
    render () {
        return (
            <div>
                <h1>I'm not excited to get this chat working...</h1>
                <form className="form">
                    <textarea
                        type="chatBox"
                        name="chatBox"
                        value={this.props.value}
                        onChange={this.handleChange}
                        className="chatBoxTextarea"/><br/>
                    <input
                        type="submit"
                        value="Submit"
                        onClick={this.handleClick}
                        className="chatBoxButton"/>
                </form>
            </div>
        )
    }
}

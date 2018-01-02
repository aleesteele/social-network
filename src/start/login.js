import React from 'react';
import axios from '../../routes/axios';
import { Link } from 'react-router';

export default class Login extends React.Component {
    constructor(props) {
        super(props); // how you're able to use the props later
        this.state = { error: false };
        this.handleSubmit = this.handleSubmit.bind(this); //you just have to do this when ya bind
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        e.preventDefault(); //stops from reloading
        this[e.target.name] = e.target.value;
    }
    handleSubmit(e) {
        e.preventDefault(); //stops from reloading
        if (!this.email || !this.password ) {
            this.setState({
                error: true
            })
        }
        else {
            console.log('LOGIN COMPONENT MOUNTING');
            console.log('this.state', this.state)
            axios.post('/login', {
                email: this.email,
                password: this.password
            }).then(({data}) => {
                console.log("RES FOR LOGIN", data);
                if (data.success) {
                    location.replace('/');
                }
                else {
                    this.setState({ error: true })
                }
        	}).catch(err => { console.log('ERR LOGIN.JS', err) })
        }
    }
    render() {
        console.log('INSIDE LOGIN COMPONENT');
        return (
            <div className="welcome-div">
                {this.state.error && <div className="error">There was an error with your input. Please try again.</div>}
                <form className="form">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={this.state.value}
                        onChange={this.handleChange}
                        className="loginFormInputs"/>
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.value}
                        onChange={this.handleChange}
                        className="loginFormInputs"/>
                    <br />
                    <input type="submit" value="Submit" className="Submit" onClick={this.handleSubmit} className="loginFormButton"/>
                </form><br />
                <div>
                    <p>Need an account? <Link className="link" to="/">Register here.</Link></p>
                </div>
            </div>
        )
    }
}

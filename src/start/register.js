import React from 'react';
import axios from '../../routes/axios';
import { Link } from 'react-router';

export default class Register extends React.Component {
    constructor(props) {
        super(props); // how you're able to use the props later
        this.state = {
            error: false,
            errorMessage: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this); //you just have to do this when ya bind
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        this[e.target.name] = e.target.value;
    }
    handleSubmit(e) {
        e.preventDefault();
        if (!this.firstname || !this.lastname || !this.email || !this.password ) {
            this.setState({
                error: true
            }) //sets error to true
        }
        else {
            console.log('REGISTER COMPONENT MOUNTING');
            axios.post('/register', {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            }).then((resp) => {
                console.log("RESP FOR REGISTER", resp);
                if (resp.data.success) {
                    location.replace('/');
                }
                else {
                    this.setState({ error: true })
                }
        	}).catch(err => { console.log('ERR REGISTER.JS', err) })
        }
    }
    render() {
        console.log('INSIDE REGISTER COMPONENT');
        return (
            <div className="welcome-div">
                {this.state.error && <div className="error">There was an error with your input. Please try again.</div>}
                <form className="form">
                    <label> <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={this.state.value}
                        onChange={this.handleChange}
                        className="registerFormInputs"/></label>
                    <br />
                    <label><input type="text" name="lastname" placeholder="Last Name" value={this.state.value} onChange={this.handleChange} className="registerFormInputs"/></label>
                    <br />
                    <label><input type="text" name="email" placeholder="Email" value={this.state.value} onChange={this.handleChange} className="registerFormInputs"/></label>
                    <br />
                    <label><input type="password" name="password" placeholder="Password" value={this.state.value} onChange={this.handleChange} className="registerFormInputs"/></label>
                    <br />
                    <input type="submit" value="Submit" onClick={this.handleSubmit} className="registerFormButton"/>
                </form>
                <div>
                    <p>Already have an account? <Link className="link" to="/login">Login here.</Link></p>
                </div>
            </div>
        )
    }
}

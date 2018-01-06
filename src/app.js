import React from 'react';
import axios from '../routes/axios';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { getSocket } from './socket';
import { reducer } from '../routes/reducers';
import { Router, Route, hashHistory, Link } from 'react-router';
import Logo from './style/logo';
import Profile from './app/profile';
import ProfPic from './app/prof-pic';
import PicUpload from './app/pic-upload';
import UpdateBio from './app/update-bio';
import OtherProfile from './app/other-prof';
import FriendButton from './app/friend-button';
import FriendsPage from './app/friends-page';
import Chat from './app/chat';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //this.state
            toggleUploader: false,
            bioChangerVisible: false
        }
        this.switchUploaderValue = this.switchUploaderValue.bind(this)
        this.toggleBioChanger = this.toggleBioChanger.bind(this)
    }
    componentDidMount() {
        getSocket();
        console.log('MOUNTING APP COMPONENT');
        axios.get('/get-user-info').then(user => { //getting info about user to pass to children
            const userData = user.data.results;
            // console.log('user || APP.JS: ', userData)
            // console.log('userData: ', userData)
            this.setState({
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email,
                userId: userData.id,
                image: userData.image,
                bio: userData.bio
            })
        }).catch(err => { console.log('err app.js || get-user-info axios || ', err) })
    }
    switchUploaderValue() {
        this.setState({ toggleUploader: !this.state.toggleUploader })
    }
    toggleBioChanger() {
        this.setState({ bioChangerVisible: !this.state.bioChangerVisible })
    }
    keepProfileUpdated() {
        axios.get('/keep-info-updated').then(data => {
            console.log('lol', data)
        })
    }
    render() {
        console.log('INSIDE APP COMPONENT');
        // console.log("App.js props: ", this.props)
        // console.log("App.js state: ", this.state)
        const { firstname, lastname, email, userId, image, bio } = this.state
        const children = React.cloneElement(this.props.children,
            {
            firstname,
            lastname,
            email,
            userId,
            image,
            bio,
            switchUploaderValue : this.switchUploaderValue,
            toggleBioChanger : this.toggleBioChanger,
            }
        )
        if (!this.state.userId) {
            return (
                <div className="loading">
                    Everything is loading...<br />
                    Be patient ok.
                </div>
            )
        }
        return(
            <div className="main-app">
                <div className="app-header">
                    <div className="mini-logo">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                    <div className="navigation">
                        <h2>DON'T FORGET!!</h2>
                        <ul className="nav">
                            <Link to="/online">See who else is online aka other guilty folk</Link><br/>
                            <Link to="#">Chat with people so you can commiserate in your laziness</Link><br/>
                            <Link to="/friends">Look at your friends AKA other forgetful ppl</Link>
                        </ul>
                    </div>
                    <div className="mini-prof">
                        <Link to="/profile">
                            <img src="user.png" className="header-icon" />
                        </Link>
                    </div>
                </div>

                <div className="app-content">
                    { children }
                    { this.state.toggleUploader &&
                        <div><PicUpload
                        updateImage={newPic => {
                            this.setState({
                                image : newPic
                            })
                        }}/></div>}
                    { this.state.bioChangerVisible &&
                        <div><BioChange
                        bioChanges={newBio => {
                            this.setState({
                                bio : newBio
                            })
                        }}/></div>}
                </div>

                <div className="app-footer">

                </div>
            </div>

        )
    }
}

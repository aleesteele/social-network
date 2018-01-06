import React from 'react';
import axios from '../../routes/axios';
import { browserHistory } from 'react-router';
import FriendButton from './friend-button';

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId
        };
    }
    componentWillReceiveProps(nextProps){
        console.log('component will recieve props', nextProps)
        this.setState({});//this method will not get called first time
    }
    componentDidMount() {
        console.log('MOUNTING OTHERPROFILE COMPONENT', this.props.params.id)
        axios.get('/user/' + this.props.params.id).then(resp => {
            // console.log('did this work?', resp.data)
            if (resp.data.success) {
                this.setState({
                    otherId : resp.data.data.id,
                    firstname: resp.data.data.firstname,
                    lastname: resp.data.data.lastname,
                    email: resp.data.data.email,
                    image: resp.data.data.image
                }, () => {
                    // console.log(this.state, 'the above was state')
                })
            }
            else {
                console.log('there was an error with this.setState for resp.data.success')
            }
        }).catch(err => { console.log('ERR || OTHERPROF || ', err) })
    }
    render() {
        if (!this.state.otherId) {
            return (
                <div className="loading">
                    <img src="loading.gif"/>
                </div>
            )
        }
        else if (this.state.otherId == this.state.userId) {
            browserHistory.push('/profile')
        }
        else {
            // console.log('this.state.otherId')
            // console.log('about to render otherprof', this.state)
            // console.log('PROPS FROM OTHERPROFILE', this.props)
            // console.log('PROPS.PARAMS FROM OTHERPROFILE', this.props.params)
            // console.log('otherUserId', this.state.otherId, 'userId', this.state.userId)
            return (
                <h1>
                    <div className="profile">
                        <div>
                            <img src={this.state.image} className="pic-in-other-prof"/><br/>
                             <FriendButton
                                 userId={this.state.userId}
                                 otherUserId={this.state.otherId}/>
                        </div><br/><br/>
                        <div className="bio-in-prof">
                            Name: {this.state.firstname} {this.state.lastname}<br />
                            Email: {this.state.email}<br />
                            Bio: {this.state.bio}
                        </div>
                    </div>


                </h1>
            )
        }
    }
}

import React from 'react';
import axios from '../../routes/axios';
import { browserHistory } from 'react-router';


export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        console.log('MOUNTING FRIENDBUTTON COMPONENT')
        axios.get('/get-friendship-status/' + this.props.otherUserId).then(resp => {
            if (resp.data.success) {
                // console.log('a friendship status already exists', resp.data.data)
                const { sender_id, reciever_id, status } = resp.data.data
                this.setState({
                    sender_id: sender_id,
                    reciever_id: reciever_id,
                    status : status
                })
                console.log('a friendship status already existed, this is the state:', this.state)
                return
            }
            else {
                const { userId, otherUserId } = this.props
                console.log('testing deconstruction', userId, otherUserId)
                this.setState({
                    status : 0,
                    friendship : 'none',
                    sender_id : userId,
                    reciever_id : otherUserId,
                    sad : 'yes'
                })
                console.log('a friendship status did not exist', this.state)
                return
            }
        }).catch(err => { console.log('ERR || FRIEND-BUTTON || FRIENDBUTTON.JS', err)} )
    }
    handleClick(e) {
        const { status, friendship, sender_id, reciever_id } = this.state
        const { userId, otherUserId } = this.props
        // console.log('this.state.status handleClick: ', this.state.status)
        /* NO STATUS*/
        if (status == 0) { //adding friend
            /* HAD PREVIOUS FRIENDSHIP*/
            if (friendship == 'none') {
                var statusChange = 1;
                console.log('this.props.otherUserId', otherUserId)
                axios.post('/add-friend-req/' + otherUserId + '/' + statusChange).then(resp => {
                    console.log('adding friend req || component.js: ', resp)
                    this.setState({
                        status : 1,
                        friendship : 'pending',
                        sad : 'possibly',
                    })
                    console.log('new state after add: ', this.state)
                    return;
                }).catch(err => { console.log('err in component, adding friendship', err) })
            }
            else { //terminate existing friend request
                axios.post('/delete-friend/' + otherUserId).then(resp => {
                    console.log('previous relationshipbut adding again: ', resp)
                    this.setState({
                        status : 3,
                        sad : 'yes'
                    })
                    return;
                }).catch((err)=> { console.log('handleClick if 0 err: ', err) })
                console.log('new state after trying to add but w/ previous rel: ', this.state)
            }
        }
        /* PENDING REQUEST */
        else if (status == 1) { //PENDING FRIEND REQUEST
            console.log('inside status=1')
            if (userId == sender_id) { //if logged in user is the same as the sender, cancel friend req
                axios.post('/delete-friend/' + otherUserId).then(resp => {
                    this.setState({
                        status : 3,
                        sad : 'yes'
                    })
                }).catch(err => { console.log('well the change friendreqterminate is not working') })
            }
            else if (userId == reciever_id) { //if the recipient user is looking at friend req
                var statusChange = 2; //accept friend request
                axios.post('/change-friend-req/' + otherUserId + '/' + statusChange).then(resp => {
                    this.setState({
                        status : 2,
                        sad : 'no!!!!!!!!!'
                    })
                    console.log('state of new friend req', this.state)
                }).catch(err => { console.log('well the change friendreqaccept is not working') })
            }
            else {
                console.log('you fucked up in status == 1');
                return;
            }
        }
        else if (this.state.status == 2) { //ACCEPTED
            console.log('inside status==2')
            var statusChange = 3; //then you should have the option to end
            axios.post('/delete-friend/' + otherUserId).then(resp => { //ending friendship == deleting from db
                console.log('resp for friendship going from accepted -> terminate', resp)
                this.setState({
                    status : 3,
                    sad : 'no!!!!!!!!!'
                })
            })
        }
        else if (this.state.status == 3) {
            console.log('inside status==3')
            var statusChange = 1;
            axios.post('/change-friend-req/' + otherUserId + '/' + statusChange).then(resp => {
                console.log('resp for friendship going from accept', resp)
                this.setState({
                    status : 1,
                    sad : 'no!!!!!!!!!'
                })
            })
        }
        else {
            console.log('lol you fucked up somewhere')
        }
    }
    changeButtonStatus() {
        const { sender_id, reciever_id } = this.state
        const { userId, otherUserId } = this.props
        console.log('this is the state in changebhuttonstatus', this.state)
        console.log('these are the props in changebutton', this.props)
        switch (this.state.status) {
            case 0: //
                return "Add Friend";
                break;
            case 1: //pending
                console.log('case 1, sender_id', sender_id)
                console.log('case 1, user_Id', userId)
                if (sender_id == userId) {
                    console.log('sender is == to userId')
                    return "Cancel Friend Request";
                    break;
                } else {
                    console.log('else statement of userId')
                    return "Accept Friendship";
                    break;
                }
            case 2: //accepted
                console.log('case 2, sender_id', sender_id)
                console.log('case 2, user_Id', userId)
                return "End Friendship"
                break;
            case 3: //terminated
                console.log('case 3, sender_id', sender_id)
                console.log('case 3, user_Id', userId)
                return "Add Friend"
                break;
        }
    }
    render() {
        console.log()
        return (
            // {this.state.error && <div className="error">There was an error. Please try again.</div>}
            <button
                type="submit"
                className="button"
                onClick={this.handleClick}
            >{this.changeButtonStatus()}</button>
        )
    }
}

// value="{this.state.friendship.status}"
// onClick={this.submitUpload}

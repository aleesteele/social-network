import React from 'react';
import { connect } from 'react-redux';
import { App } from '../app';
import { Link } from 'react-router';
import { getFriendList, acceptFriend, termFriend } from '../../routes/actions';

class FriendsPage extends React.Component {
    componentDidMount() {
        //race error - could try to render getFriendList before the friend list was loaded?
        //who knoooows!
        this.props.getFriendList();
    }
    render() {
        const { acceptFriend, termFriend, getFriendList } = this.props
        console.log('these are the props: ', this.props)

        if (!this.props.pending || !this.props.friends) {
            console.log('pending: ', this.props.pending, 'friends', this.props.friends)
            return (
                <div>
                    <p>Loading the friends page...</p>
                </div>
            )
        }

        else {
            const pendingFriends = this.props.pending.map(pending => (
                <div>{pending.firstname} {pending.lastname}
                    <Link to={`/profile/${pending.id}`}>
                        <img src={pending.image} className="pending-img" />
                    </Link>
                    <button className="button" onClick={() => acceptFriend(pending.id)}>Accept</button>
                    <button className="button" onClick={() => termFriend(pending.id)}>Reject</button>
                </div>
            ))
            // console.log('PENDING FREEEEIIIINNNDDDDS', pendingFriends)

            const acceptedFriends = this.props.friends.map(friend => (
                <div>{friend.firstname} {friend.lastname}
                    <Link to={`/profile/${friend.id}`}>
                        <img src={friend.image} className="accepted-img" />
                    </Link>
                    <button className="button" onClick={() => termFriend(friend.id)}>Remove</button>
                </div>
            ))

            return (
                <div>
                    Pending requests:<br/>
                    <div className="pending">
                        <ul>{ pendingFriends }</ul>
                    </div>
                    Current Friends:<br/>
                    <div className="accepted">
                        <ul>{ acceptedFriends }</ul>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = function(state) {
    return {
        friends: state.users && state.users.filter(user => user.status == 2 ),
        pending: state.users && state.users.filter(user => user.status == 1 )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        getFriendList: () => dispatch(getFriendList()),
        acceptFriend: (otherUserId) => dispatch(acceptFriend(otherUserId)),
        termFriend: (otherUserId) => dispatch(termFriend(otherUserid)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsPage);

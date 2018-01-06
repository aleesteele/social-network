import React from 'react';
import { socket } from '../socket';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// import { getOnlineUsers } from '../../routes/actions';

class Online extends React.Component {
    componentDidMount() {
        // this.props.getOnlineUsers();
        console.log('this.props: ', this.props)
    }
    // socket().emit('onlineUsers', {
    //     message: this.message
    // });
    // console.log(socket)
    render () {
        // const { getOnlineUsers } = this.props
        // console.log('these are the props: ', this.props)

        if (!this.props.onlineUsers) {
            return (
                <div>
                    <img src="loading.gif"/>
                </div>
            )
        }
        else {
            const onlineUsers = this.props.onlineUsers.map(online => (
                <div className="online-users">
                        <h2>{online.firstname} {online.lastnsame}</h2>
                    <br />
                    <Link to={`/profile/${online.id}`}>
                        <img src={online.image} className="online-img" />
                    </Link>
                </div>
            ))

            return (
                <div className="online-div">
                    <h1>Online Users</h1>
                    <div>
                        <ul>{ onlineUsers }</ul>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = function(state) {
    console.log('state in mapStateToProps', state.onlineUsers)
    return {
        onlineUsers : state.onlineUsers
    }
}

export default connect(mapStateToProps)(Online);


//server: connected sockets
////gets info from db
///socket full of info is being emitted to client side socket.js
///socket has to be listened for in socket.js

///in the component: online
//redux:
////action:
////

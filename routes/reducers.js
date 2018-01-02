export default function(state = {}, action) {

    if (action.type == 'RECEIVE_FRIENDS') {
        console.log('inside reducer, receiving friends');
        state = Object.assign({}, state, {
            users: action.users
        })
        console.log('getting friends', state)
    }

    if (action.type == 'TERMINATE_FRIEND') {
        console.log('inside reducer, terminating friend');
        state = Object.assign({}, state, {
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: action.status
                    });
                } else {
                    return user;
                }
            })
        });
        console.log('terminate friends || reducer: ', state)
    }

    if (action.type == 'ACCEPT_FRIEND_REQ') {
        console.log('inside reducer, accepting friend');
        state = Object.assign({}, state, {
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: action.status
                    });
                } else {
                    return user;
                }
            })
        });
        console.log('accept friends || reducer: ', state)
    }

    if (action.type == 'GET_ONLINE_USERS') {
        console.log('inside reducer, getting online users || action.onlineUsers', action.onlineUsers);
        state = Object.assign({}, state, { onlineUsers: action.onlineUsers });
        console.log('recieve friends || reducer: ', state)
    }

    // if (action.type == 'GET_ONLINE_USERS') {
    //     // console.log('inside reducer, getting online users || action.onlineUsers', action.onlineUsers);
    //     state = Object.assign({}, state, { onlineUsers: action.onlineUsers });
    //     console.log('recieve friends || reducer: ', state)
    // }
    //
    // if (action.type == 'GET_ONLINE_USERS') {
    //     // console.log('inside reducer, getting online users || action.onlineUsers', action.onlineUsers);
    //     state = Object.assign({}, state, { onlineUsers: action.onlineUsers });
    //     console.log('recieve friends || reducer: ', state)
    // }

    console.log('reducer: ', state)
    return state;
}

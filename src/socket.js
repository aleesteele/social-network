import * as io from 'socket.io-client';
import axios from 'axios';
import { store } from './start';
import { getOnlineUsers } from '../routes/actions';
// import { userJoined } from './actions';

let socket;

function getSocket() {
    if (!socket) {
        socket = io.connect();

        socket.on('connect', function() {
            console.log('inside the socket.on connect || socket.js')
            axios.get('/connected/' + socket.id)
            // .then( () => { console.log('yay'; ) })
            // .catch(err => {})
        })

        socket.on('onlineUsers', function(results) {
            console.log('onlineUsers from socket.js', results.onlineUsers)
            store.dispatch(getOnlineUsers(results.onlineUsers));
            // listening for message from onlineUsers, which will be an array of all users' INFO
            // once it has it, it'll send that information to the actions
            // action --> reducer --> store (all)
        })

        // socket.on('userWhoJoined', function() {
        //     console.log('userWhoJoined', )
        //     store.dispatch(actionNameHere());
        //     dispatch action here
        // })

        // socket.on('userWhoLeft', function() {
        //     console.log('userWhoLeft', )
        //     // store.dispatch(actionNameHere());
        //     // dispatch action here
        // })

        // socket.on('')


    }
    return socket;
}

export { getSocket };

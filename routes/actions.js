import axios from './axios';

/* ----------- FRIENDS PAGE || SOCKET.IO ----------- */
export function getFriendList() {
    return axios.get('/friend-list').then(function( { data }) {
        console.log('actions.js || this is the daaataaaa for friend list: ', data)
        return {
            type : 'RECEIVE_FRIENDS',
            users : data.data
        }
    }).catch(err => { console.log('err with getFriendList action || actions.js || ', err) })
}

export function acceptFriend(otherUserId) { //2 == accepted
    console.log('inside acceptFriend', otherUserId)
    return axios.post('/change-friend-req/' + otherUserId + '/2').then(function( { data }) {
        console.log('otherUserId in acceptFriend', otherUserId)
        return {
            type : 'ACCEPT_FRIEND_REQ',
            otherUserId : otherUserId,
            status : 2 //2 == accepted
        }
    }).catch(err => { console.log('err with acceptPending action || actions.js || ', err) })
}

export function termFriend(otherUserId) { //3 terminated
    return axios.post('/delete-friend/' + otherUserId).then(function( { data }) {
        console.log('otherUserId in termFriend', otherUserId)
        return {
            type : 'TERMINATE_FRIEND',
            otherUserId : otherUserId,
            status : 3 //3 == terminated
        }
    }).catch(err => { console.log('err with deleteFriend action || actions.js || ', err) })
}

/* ----------- ONLINE PAGE // SOCKET.IO ----------- */

export function getOnlineUsers(onlineUsers) {
    // console.log('getOnlineUsers', onlineUsers)
    console.log('inside actions || getOnlineUsers || stuff', onlineUsers)
    return {
        type : "GET_ONLINE_USERS",
        onlineUsers
    };
}

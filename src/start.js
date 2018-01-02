/*------------------COMPONENTS------------------/*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as io from 'socket.io-client';
import reduxPromise from 'redux-promise';
import reducer from '../routes/reducers';
import Welcome from './start/welcome';
import Register from './start/register';
import Login from './start/login';
import App from './app';
import Home from './home';
import Profile from './app/profile';
import UpdateBio from './app/update-bio';
import OtherProfile from './app/other-prof';
import FriendsPage from './app/friends-page';
import Online from './app/online';
import Chat from './app/chat';

let router;

export const store = createStore(reducer, applyMiddleware(reduxPromise));


/*/------------------ROUTER------------------/*/
const notLoggedInRouter = (
        <Router history={hashHistory}>
            <Route path="/" component={Welcome}>
                <IndexRoute component={Register} />
                <Route path="/login" component={Login} />
      	    </Route>
        </Router>
)

const loggedInRouter = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="/profile" component={Profile} />
                <Route path="/profile/:id" component={OtherProfile} />
                <Route path="/friends" component={FriendsPage} />
                <Route path="/online" component={Online} />
                <Route path="/chat" component={Chat}/>
                <Redirect from="*" to="/profile" />
      	    </Route>
        </Router>
    </Provider>
)

if (location.pathname == '/welcome') {
    router = notLoggedInRouter;
} else {
    router = loggedInRouter;
}

ReactDOM.render(
    router,
    document.querySelector('main')
)

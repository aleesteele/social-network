import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'cookie-thing',
    xsrfHeaderName: 'csrf-token'
});

export default instance;

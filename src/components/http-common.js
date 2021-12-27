import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
        'Content-type': 'application/json',
        //'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    credentials: 'include', //withCredentials: true,
});

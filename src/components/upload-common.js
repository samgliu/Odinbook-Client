import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
        'Content-Type': 'multipart/form-data',
        //'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    credentials: 'include', //withCredentials: true,
});

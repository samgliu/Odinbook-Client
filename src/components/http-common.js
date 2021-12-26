import axios from 'axios';

export default axios.create({
    //baseURL: 'http://localhost:3001',
    baseURL: 'http://172.18.83.91:3001',
    headers: {
        'Content-type': 'application/json',
        //'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    credentials: 'include', //withCredentials: true,
});

import axios from 'axios';

export default axios.create({
    //baseURL: 'http://localhost:3001',
    baseURL: 'http://172.28.12.133:3001',
    headers: {
        'Content-type': 'application/json',
        //'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    credentials: 'include', //withCredentials: true,
});

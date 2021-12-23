import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-type': 'application/json',
        //'Access-Control-Allow-Origin': 'https://samgliu.github.io',must change to client side host domain
    },
    withCredentials: true,
});

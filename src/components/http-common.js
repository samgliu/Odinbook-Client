import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    accept: 'application/json',
    'Content-type': 'application/json',
  },
  credentials: 'include', //withCredentials: true,
});

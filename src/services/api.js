import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rms-bakcend.onrender.com/api', // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

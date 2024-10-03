import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error.response ? error.response.data : error.message);
  }
);

export default API;

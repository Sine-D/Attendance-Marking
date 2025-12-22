import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api/students' : 'http://localhost:5000/api/students'),
});

export default api;

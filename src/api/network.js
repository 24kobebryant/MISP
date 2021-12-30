import axios from 'axios';


axios.defaults.headers['Content-Type'] = 'application/json';

const service = axios.create({
  baseURL: '/api',
  timeout: 60 * 1000
});

export default service;
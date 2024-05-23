import axios from 'axios';

// Create axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  timeout: 60000, // Request timeout
});

export default service;

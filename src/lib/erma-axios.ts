import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_ERMA_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_ERMA_API_BASE_URL;
  }

  // Check if we're running in a browser environment
  if (typeof window !== 'undefined') {
    // Use the current origin as the base URL
    return `${window.location.origin}/api`;
  }

  // Fallback for server-side
  return 'http://localhost:3000/api';
};

// Create axios instance with custom config

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // You can add custom headers here, like authentication tokens
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

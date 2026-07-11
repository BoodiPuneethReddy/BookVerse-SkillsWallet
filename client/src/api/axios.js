import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Request Interceptor: Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'Something went wrong';

    if (status === 401) {
      toast.error('Session expired or unauthorized. Redirecting to login...');
      
      // Determine redirection based on current path or role
      const role = localStorage.getItem('role') || 'user';
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin/login';
        } else if (role === 'seller') {
          window.location.href = '/seller/login';
        } else {
          window.location.href = '/user/login';
        }
      }, 1500);
    } else if (status === 403) {
      toast.error(`Access Forbidden: ${message}`);
    } else if (status === 500) {
      toast.error(`Server Error: ${message}`);
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;

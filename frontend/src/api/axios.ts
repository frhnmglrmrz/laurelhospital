import axios from 'axios';

// Create an Axios instance configured to point to our Vite proxy
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add logic here to fetch tokens from localStorage/Pinia
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

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle global errors like 401 Unauthorized here
    if (error.response?.status === 401) {
      console.error('Unauthorized access - Handle logout');
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

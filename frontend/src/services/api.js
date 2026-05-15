import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000, // 10 seconds global timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('climacast_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors, retries, and 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response, code } = error;

    // 1. Handle 401 Unauthorized
    if (response && response.status === 401) {
      localStorage.removeItem('climacast_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // 2. Simple Retry Logic for timeouts or network errors on GET requests
    const maxRetries = 2; // Total 3 attempts
    config._retryCount = config._retryCount || 0;

    const isRetryableError = code === 'ECONNABORTED' || !response; // Timeout or Network error
    const isGetRequest = config.method === 'get';

    if (isRetryableError && isGetRequest && config._retryCount < maxRetries) {
      config._retryCount += 1;
      console.warn(`API Timeout/Error. Retrying ${config.url} (Attempt ${config._retryCount})...`);
      
      // Exponential backoff
      const delay = config._retryCount * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;

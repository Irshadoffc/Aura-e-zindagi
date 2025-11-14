import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add retry logic for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Retry logic for timeout errors
    if (error.code === 'ECONNABORTED' && !config._retry) {
      config._retry = true;
      config._retryCount = config._retryCount || 0;
      
      if (config._retryCount < 2) { // Retry up to 2 times
        config._retryCount++;
        console.log(`Retrying request... Attempt ${config._retryCount}`);
        return new Promise(resolve => {
          setTimeout(() => resolve(api(config)), 1000); // Wait 1 second before retry
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Add token to requests if available
api.interceptors.request.use(
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

// Handle token expiration (moved to request interceptor above)

export default api;

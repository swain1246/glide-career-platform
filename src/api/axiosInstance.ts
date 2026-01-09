// src/api/axiosInstance.ts
import axios from 'axios';
import { API_BASE_URL } from './apiConstants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Set to true if using cookies
  
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Fire custom event instead of directly clearing
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

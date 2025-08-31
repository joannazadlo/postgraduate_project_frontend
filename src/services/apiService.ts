import axios from 'axios';
import { getFirebaseIdToken } from './firebaseService';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const apiService = axios.create({
  baseURL: API_URL,
});

apiService.interceptors.request.use(
  async (config) => {
    const idToken = await getFirebaseIdToken();
    if (idToken) {
      config.headers['Authorization'] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiService;

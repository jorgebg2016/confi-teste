import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiValidationError extends Error {
  errors?: Record<string, string>;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message = data?.error || data?.message || error.message || 'Ocorreu um erro';
    const rejection: ApiValidationError = new Error(message);
    if (data?.errors) {
      rejection.errors = data.errors;
    }
    return Promise.reject(rejection);
  }
);

export default api;

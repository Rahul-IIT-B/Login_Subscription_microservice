// frontend\src\services\api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Get token from either cookies or localStorage
  const token = typeof window !== 'undefined' 
    ? Cookies.get('token')
    : null;
    
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getPosts = (authorId?: string) => 
  api.get('/posts', { params: authorId ? { author: authorId } : {} });

export const createPost = (post: { title: string; content: string }) => 
  api.post('/post', post);

export const login = (credentials: { email: string; password: string }) => 
  api.post('/login', credentials);

export const signup = (credentials: { email: string; password: string }) => 
  api.post('/signup', credentials);
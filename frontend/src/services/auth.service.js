import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, new_password: newPassword });
    return response;
  }
};

export default authService;

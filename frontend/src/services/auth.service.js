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
  }
};

export default authService;

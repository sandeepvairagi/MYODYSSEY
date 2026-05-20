import api from './api';

export const destinationService = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getTrending: () => api.get('/destinations/trending'),
  getFeatured: () => api.get('/destinations/featured'),
  getRecommendations: () => api.get('/destinations/recommendations'),
  generateItinerary: (id, data) => api.post(`/destinations/${id}/itinerary`, data),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
};

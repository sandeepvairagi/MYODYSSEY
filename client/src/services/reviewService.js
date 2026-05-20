import api from './api';

export const reviewService = {
  getByDestination: (id, params) => api.get(`/reviews/destination/${id}`, { params }),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

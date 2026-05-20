import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getEstimate: (params) => api.get('/bookings/estimate', { params }),
};

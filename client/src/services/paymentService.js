import api from './api';

export const paymentService = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  verify: (data) => api.post('/payments/verify', data),
};

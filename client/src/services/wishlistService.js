import api from './api';

export const wishlistService = {
  get: () => api.get('/wishlist'),
  toggle: (destinationId) => api.post(`/wishlist/${destinationId}`),
};

import api from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getBookings: () => api.get('/admin/bookings'),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
};

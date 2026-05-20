import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import destinationReducer from './slices/destinationSlice';
import wishlistReducer from './slices/wishlistSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
    wishlist: wishlistReducer,
    bookings: bookingReducer,
  },
});

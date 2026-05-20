import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService';

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await bookingService.getMy();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await bookingService.create(data);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    setCurrentBooking: (state, action) => { state.current = action.payload; },
    clearBookingError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (s) => { s.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(createBooking.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createBooking.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(createBooking.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;

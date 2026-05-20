import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { destinationService } from '../../services/destinationService';

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await destinationService.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDestination = createAsyncThunk(
  'destinations/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await destinationService.getById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTrending = createAsyncThunk('destinations/trending', async (_, { rejectWithValue }) => {
  try {
    const res = await destinationService.getTrending();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchFeatured = createAsyncThunk('destinations/featured', async (_, { rejectWithValue }) => {
  try {
    const res = await destinationService.getFeatured();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    list: [],
    current: null,
    reviews: [],
    trending: [],
    featured: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; state.reviews = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (s) => { s.loading = true; })
      .addCase(fetchDestinations.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.data;
        s.total = a.payload.total;
        s.totalPages = a.payload.totalPages;
        s.currentPage = a.payload.currentPage;
      })
      .addCase(fetchDestinations.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchDestination.pending, (s) => { s.loading = true; })
      .addCase(fetchDestination.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload.destination;
        s.reviews = a.payload.reviews;
      })
      .addCase(fetchDestination.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchTrending.fulfilled, (s, a) => { s.trending = a.payload; })
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload; });
  },
});

export const { clearCurrent } = destinationSlice.actions;
export default destinationSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await wishlistService.get();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (id, { rejectWithValue }) => {
  try {
    const res = await wishlistService.toggle(id);
    return { id, added: res.data.added };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], ids: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (s, a) => {
        s.items = a.payload;
        s.ids = a.payload.map((d) => d._id);
      })
      .addCase(toggleWishlist.fulfilled, (s, a) => {
        const { id, added } = a.payload;
        if (added) s.ids.push(id);
        else s.ids = s.ids.filter((i) => i !== id);
      });
  },
});

export default wishlistSlice.reducer;

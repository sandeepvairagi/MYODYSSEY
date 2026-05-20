import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.login(data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data.user;
  } catch (err) {
    localStorage.removeItem('token');
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout(); } catch { /* ignore */ }
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isAuthenticated = true;
      })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(getMe.pending, (s) => { s.loading = true; })
      .addCase(getMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(getMe.rejected, (s) => { s.loading = false; s.user = null; s.token = null; s.isAuthenticated = false; })
      .addCase(logout.fulfilled, (s) => { s.user = null; s.token = null; s.isAuthenticated = false; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

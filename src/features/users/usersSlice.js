import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://api.freeapi.app/api/v1/public/randomusers'
      );

      // HTTP error status check
      if (!response.ok) {
        return rejectWithValue(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // API might return success:false with message
      if (data.success === false && data.message) {
        return rejectWithValue(data.message);
      }

      return data; // Success payload
    } catch (error) {
      // Network error
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'pending';
        state.error = null; // Purani error clear
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Safe access with optional chaining + fallback
        state.users = action.payload?.data?.data || [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        // Payload wahi message hai jo rejectWithValue ne bheja
        state.error = action.payload || action.error.message;
        state.users = []; // Users clear on error
      });
  },
});

export default usersSlice.reducer;

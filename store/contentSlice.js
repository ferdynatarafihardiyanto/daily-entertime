import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContents, getSchedules } from '../lib/api';

// Async thunk untuk mengambil data content dari API
export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async () => {
    const response = await getContents();
    return response.data;
  }
);

// Async thunk untuk mengambil data schedule
export const fetchSchedulesData = createAsyncThunk(
  'content/fetchSchedules',
  async () => {
    const response = await getSchedules();
    return response.data || [];
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    schedules: [],
    schedulesStatus: 'idle',
  },
  reducers: {
    // Digunakan untuk memaksa fetch ulang jika diperlukan
    invalidateContent: (state) => {
      state.status = 'idle';
    },
    invalidateSchedules: (state) => {
      state.schedulesStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Schedules
      .addCase(fetchSchedulesData.pending, (state) => {
        state.schedulesStatus = 'loading';
      })
      .addCase(fetchSchedulesData.fulfilled, (state, action) => {
        state.schedulesStatus = 'succeeded';
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesData.rejected, (state) => {
        state.schedulesStatus = 'failed';
        state.schedules = [];
      });
  }
});

export const { invalidateContent, invalidateSchedules } = contentSlice.actions;
export default contentSlice.reducer;

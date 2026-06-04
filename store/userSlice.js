import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookmarks, getHistories } from '../lib/api';

export const fetchBookmarksData = createAsyncThunk(
  'user/fetchBookmarks',
  async () => {
    const response = await getBookmarks();
    return response.data || [];
  }
);

export const fetchHistoryData = createAsyncThunk(
  'user/fetchHistories',
  async () => {
    const response = await getHistories();
    return response.data || [];
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    bookmarks: [],
    bookmarksStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    history: [],
    historyStatus: 'idle',
  },
  reducers: {
    invalidateBookmarks: (state) => {
      state.bookmarksStatus = 'idle';
    },
    invalidateHistory: (state) => {
      state.historyStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Bookmarks
      .addCase(fetchBookmarksData.pending, (state) => {
        state.bookmarksStatus = 'loading';
      })
      .addCase(fetchBookmarksData.fulfilled, (state, action) => {
        state.bookmarksStatus = 'succeeded';
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmarksData.rejected, (state) => {
        state.bookmarksStatus = 'failed';
        state.bookmarks = []; // if failed, e.g. not logged in
      })
      // History
      .addCase(fetchHistoryData.pending, (state) => {
        state.historyStatus = 'loading';
      })
      .addCase(fetchHistoryData.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchHistoryData.rejected, (state) => {
        state.historyStatus = 'failed';
        state.history = [];
      });
  }
});

export const { invalidateBookmarks, invalidateHistory } = userSlice.actions;
export default userSlice.reducer;

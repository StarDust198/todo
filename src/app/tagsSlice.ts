import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITag } from '../models/Tag';
import type { RootState } from '../app/store';

interface tagsState {
  tags: ITag[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: tagsState = {
  tags: [],
  status: 'idle',
  error: null,
};

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const response = await axios.get<ITag[]>('http://localhost:3001/tags');
  return response.data;
});

export const addNewTag = createAsyncThunk(
  'tags/addNewTag',
  async (tag: ITag) => {
    const response = await axios.post<ITag>('http://localhost:3001/tags', tag);
    return response.data;
  }
);

export const deleteTag = createAsyncThunk(
  'tags/deleteTag',
  async (tagName: string) => {
    await axios.delete(`http://localhost:3001/tags/${tagName}`);
    return tagName;
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addTag(state, action) {},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<ITag[]>) => {
        state.status = 'success';
        state.tags = state.tags.concat(action.payload);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.error.message || null;
      })
      .addCase(addNewTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      });
  },
});

export default tagsSlice.reducer;

export const selectAllTags = (state: RootState) => state.tags.tags;
export const selectTagByName = (state: RootState, tagName: string) =>
  state.tags.tags.find((tag) => tag.id === tagName);

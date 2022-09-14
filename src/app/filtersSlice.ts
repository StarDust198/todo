import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITag } from '../models/Tag';
import { LoadingStates } from '../models/LoadingStates';
import { Filters } from '../models/Filters';
import type { RootState } from './store';

interface filtersState {
  tags: ITag[];
  activeFilter: Filters;
  activeTags: string[];
  status: LoadingStates;
  error: string | null;
}

const initialState: filtersState = {
  tags: [],
  activeFilter: Filters.TODAY,
  activeTags: [],
  status: LoadingStates.IDLE,
  error: null,
};

export const fetchTags = createAsyncThunk('filters/fetchTags', async () => {
  const response = await axios.get<ITag[]>('http://localhost:3001/tags');
  return response.data;
});

export const addNewTag = createAsyncThunk(
  'filters/addNewTag',
  async (tag: ITag) => {
    const response = await axios.post<ITag>('http://localhost:3001/tags', tag);
    return response.data;
  }
);

export const deleteTag = createAsyncThunk(
  'filters/deleteTag',
  async (tagName: string) => {
    await axios.delete(`http://localhost:3001/tags/${tagName}`);
    return tagName;
  }
);

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<Filters>) {
      state.activeFilter = action.payload;
    },
    switchActiveTag(state: filtersState, action: PayloadAction<string>) {
      const tag = action.payload;
      let activeTags = [...state.activeTags];
      if (activeTags.includes(tag)) {
        state.activeTags = activeTags.filter((item) => item !== tag);
      } else {
        state.activeTags.push(tag);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state, action) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<ITag[]>) => {
        state.status = LoadingStates.SUCCESS;
        state.tags = state.tags.concat(action.payload);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = LoadingStates.FAIL;
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

export const { setActiveFilter, switchActiveTag } = filtersSlice.actions;

export default filtersSlice.reducer;

export const selectAllTags = (state: RootState) => state.filters.tags;
export const selectTagByName = (state: RootState, tagName: string) =>
  state.filters.tags.find((tag) => tag.id === tagName);
export const selectTagNames = (state: RootState) =>
  state.filters.tags.map((tag) => tag.id);

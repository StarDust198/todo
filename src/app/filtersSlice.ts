import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';

import { axiosIns } from './axiosIns';
import { ITag } from '../models/Tag';
import { LoadingStates } from '../models/LoadingStates';
import { Filters } from '../models/Filters';
import type { RootState } from './store';
// import { selectAllTasks, updateTask } from './tasksSlice';
// import { filterTags, selectAllTasks, updateTask } from './tasksSlice';

const filtersAdapter = createEntityAdapter<ITag>();

interface filtersState extends EntityState<ITag> {
  activeFilter: Filters;
  activeTags: string[];
  status: LoadingStates;
  error: string | null;
}

const initialState: filtersState = filtersAdapter.getInitialState({
  activeFilter: Filters.INCOMING,
  activeTags: [],
  status: LoadingStates.IDLE,
  error: null,
});

export const fetchTags = createAsyncThunk('filters/fetchTags', async () => {
  const response = await axiosIns.get<ITag[]>('/tags.json');
  return response.data || [];
});

export const addNewTag = createAsyncThunk(
  'filters/addNewTag',
  async (tag: ITag) => {
    const response = await axiosIns.put<ITag>(`/tags/${tag.id}.json`, tag);
    return response.data;
  }
);

export const deleteTag = createAsyncThunk(
  'filters/deleteTag',
  async (tagName: string) => {
    await axiosIns.delete(`/tags/${tagName}.json`);
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
    deactivateTag(state: filtersState, action: PayloadAction<string>) {
      state.activeTags = state.activeTags.filter(
        (item) => item !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTags.pending, (state, action) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<ITag[]>) => {
        state.status = LoadingStates.SUCCESS;
        filtersAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = LoadingStates.FAIL;
        state.error = action.error.message || null;
      })
      .addCase(addNewTag.fulfilled, filtersAdapter.addOne)
      .addCase(deleteTag.fulfilled, filtersAdapter.removeOne);
  },
});

export const { setActiveFilter, switchActiveTag, deactivateTag } =
  filtersSlice.actions;

export default filtersSlice.reducer;

export const {
  selectAll: selectAllTags,
  selectById: selectTagByName,
  selectIds: selectTagNames,
} = filtersAdapter.getSelectors((state: RootState) => state.filters);

export const selectActiveTags = (state: RootState) => state.filters.activeTags;
export const selectActiveFilter = (state: RootState) =>
  state.filters.activeFilter;

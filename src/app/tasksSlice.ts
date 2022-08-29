import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITask } from '../models/Task';
import type { RootState } from '../app/store';

interface tasksState {
  tasks: ITask[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: tasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get<ITask[]>('http://localhost:3001/tasks');
  return response.data;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action) {},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<ITask[]>) => {
          state.status = 'success';
          state.tasks = state.tasks.concat(action.payload);
        }
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'fail';
        state.error = action.error.message || null;
      });
  },
});

export default tasksSlice.reducer;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;

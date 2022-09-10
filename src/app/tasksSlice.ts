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

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (task: ITask) => {
    const response = await axios.post<ITask>(
      'http://localhost:3001/tasks',
      task
    );
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number) => {
    await axios.delete(`http://localhost:3001/tasks/${taskId}`);
    return taskId;
  }
);

export const switchCompletionTask = createAsyncThunk(
  'tasks/switchCompletion',
  async (taskId: number, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const initialTask = selectTaskById(state, taskId);
    const response = await axios.patch<ITask>(
      `http://localhost:3001/tasks/${taskId}`,
      { completed: !initialTask?.completed }
    );
    console.log(response.data);
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
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
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(switchCompletionTask.fulfilled, (state, action) => {
        const taskId = action.payload.id;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) task.completed = action.payload.completed;
      });
  },
});

export default tasksSlice.reducer;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksByFilter = (
  state: RootState,
  filter: 'completed' | 'timeMatches'
) => state.tasks.tasks.filter((task: ITask) => task[filter]);
export const selectTaskById = (state: RootState, taskId: number) =>
  state.tasks.tasks.find((task) => task.id === taskId);

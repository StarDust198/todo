import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { ITask } from '../models/Task';
import type { RootState } from '../app/store';
import { Filters } from '../models/Filters';

interface tasksState {
  tasks: ITask[];
  selectedTask: number | null;
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
}

const initialState: tasksState = {
  tasks: [],
  selectedTask: null,
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
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: ITask) => {
    const response = await axios.patch<ITask>(
      `http://localhost:3001/tasks/${task.id}`,
      task
    );
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectTask(state, action) {
      state.selectedTask = action.payload;
    },
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
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskId = action.payload.id;
        const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) state.tasks[taskIndex] = action.payload;
      });
  },
});

export const { selectTask } = tasksSlice.actions;

export default tasksSlice.reducer;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksByTag = (state: RootState, tag: string) =>
  state.tasks.tasks.filter((task: ITask) => task.tags.includes(tag));
export const selectTaskById = (state: RootState, taskId: number | null) =>
  state.tasks.tasks.find((task) => task.id === taskId);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  (state: RootState) => state.filters,
  (tasks, filters) => {
    const { activeFilter, activeTags } = filters;
    const showAllTasks =
      activeFilter !== Filters.COMPLETED && activeFilter !== Filters.DELETED;
    if (showAllTasks && activeTags.length === 0) {
      return tasks;
    }

    const completedStatus = activeFilter === Filters.COMPLETED;
    const deletedStatus = activeFilter === Filters.DELETED;
    return tasks.filter((task) => {
      const statusMatches =
        showAllTasks ||
        (task.completed && completedStatus) ||
        (task.deleted && deletedStatus);
      const tagMatches =
        activeTags.length === 0 ||
        activeTags.every((tag) => task.tags.includes(tag));
      return statusMatches && tagMatches;
    });
  }
);

export const countTasksByFilter = createSelector(
  [
    (state: RootState) => state.tasks.tasks,
    (state: RootState, filter: string | Filters | undefined) => filter,
  ],
  (tasks, filter) => {
    // Should never happen
    if (typeof filter === 'undefined') return 0;

    if (typeof filter === 'string') {
      return tasks.filter(
        (task) => task.tags.includes(filter) && !task.completed && !task.deleted
      ).length;
    } else {
      switch (filter) {
        case Filters.DELETED:
          return tasks.filter((task) => task.deleted).length;
        case Filters.COMPLETED:
          return tasks.filter((task) => task.completed).length;
        default:
          return tasks.length;
      }
    }
  }
);

// export const selectFilteredTasks = createSelector(
//   // Pass our other memoized selector as an input
//   selectFilteredTasks,
//   // And derive data in the output selector
//   (filteredTodos) => filteredTodos.map((todo) => todo.id)
// );

// const selectItemsByCategory = createSelector(
//   [
//     // Usual first input - extract value from `state`
//     state => state.items,
//     // Take the second arg, `category`, and forward to the output selector
//     (state, category) => category
//   ],
//   // Output selector gets (`items, category)` as args
//   (items, category) => items.filter(item => item.category === category)
// )

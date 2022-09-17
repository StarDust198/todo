import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { EntityState } from '@reduxjs/toolkit/dist/entities/models';

import type { RootState } from '../app/store';
import { ITask } from '../models/Task';
import { Filters } from '../models/Filters';
import { LoadingStates } from '../models/LoadingStates';
import {
  addNewTag,
  selectTagNames,
  // selectActiveFilter,
  // selectActiveTags,
} from './filtersSlice';
import { Tag } from '../models/Tag';

const tasksAdapter = createEntityAdapter<ITask>();

interface tasksState extends EntityState<ITask> {
  activeTask: string;
  status: LoadingStates;
  error: string | null;
}

const initialState: tasksState = tasksAdapter.getInitialState({
  activeTask: '',
  status: LoadingStates.IDLE,
  error: null,
});

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get<ITask[]>('http://localhost:3001/tasks');
  return response.data;
});

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (task: ITask, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    const initialTags = [...selectTagNames(getState() as RootState)];
    task.tags.forEach((tag) => {
      if (!initialTags.includes(tag)) dispatch(addNewTag(new Tag(tag)));
    });
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
  async (taskId: string, thunkAPI) => {
    const { getState } = thunkAPI;
    const initialTask = selectTaskById(getState() as RootState, taskId);
    await axios.patch<ITask>(`http://localhost:3001/tasks/${taskId}`, {
      completed: !initialTask?.completed,
    });
    return { id: taskId, changes: { completed: !initialTask?.completed } };
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: ITask, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    const initialTags = [...selectTagNames(getState() as RootState)];
    task.tags.forEach((tag) => {
      if (!initialTags.includes(tag)) dispatch(addNewTag(new Tag(tag)));
    });
    await axios.patch<ITask>(`http://localhost:3001/tasks/${task.id}`, task);
    return { id: task.id, changes: { ...task } };
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setActiveTask(state, action) {
      state.activeTask = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = LoadingStates.LOADING;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<ITask[]>) => {
          state.status = LoadingStates.SUCCESS;
          // state.tasks = state.tasks.concat(action.payload);
          tasksAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = LoadingStates.FAIL;
        state.error = action.error.message || null;
      })
      .addCase(addNewTask.fulfilled, tasksAdapter.addOne)
      .addCase(deleteTask.fulfilled, tasksAdapter.removeOne)
      .addCase(switchCompletionTask.fulfilled, tasksAdapter.updateOne)
      .addCase(updateTask.fulfilled, tasksAdapter.updateOne);
  },
});

export const { setActiveTask } = tasksSlice.actions;
export default tasksSlice.reducer;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);

export const selectTaskIdsByTag = createSelector(
  [selectAllTasks, (state, tagName) => tagName],
  (tasks, tagName) =>
    tasks.filter((task) => task.tags.includes(tagName)).map((task) => task.id)
);

export const selectFilteredTasks = createSelector(
  [
    selectAllTasks,
    (state: RootState) => state.filters.activeFilter,
    (state: RootState) => state.filters.activeTags,
  ],
  (tasks, activeFilter, activeTags) => {
    const showAllTasks =
      activeFilter !== Filters.COMPLETED && activeFilter !== Filters.DELETED;
    if (showAllTasks && activeTags.length === 0) return tasks;

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
    selectAllTasks,
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

// export const filteredTasks = createSelector(
//   [
//     selectAllTasks,
//     selectActiveFilter,
//     selectActiveTags,
//   ],
//   (tasks, activeFilter, activeTags) => {

//     if (typeof filter === 'string') {
//       return tasks.filter(
//         (task) => task.tags.includes(filter) && !task.completed && !task.deleted
//       ).length;
//     } else {
//       switch (filter) {
//         case Filters.DELETED:
//           return tasks.filter((task) => task.deleted).length;
//         case Filters.COMPLETED:
//           return tasks.filter((task) => task.completed).length;
//         default:
//           return tasks.length;
//       }
//     }
//   }
// );

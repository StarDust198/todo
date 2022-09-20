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
import { Filters, FilterGroup } from '../models/Filters';
import { LoadingStates } from '../models/LoadingStates';
import {
  addNewTag,
  selectTagNames,
  selectActiveFilter,
  selectActiveTags,
} from './filtersSlice';
import { Tag } from '../models/Tag';
import { checkDay, checkWeek, checkIncoming } from './checkDates';

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
    const newComplete = initialTask?.completed ? '' : new Date().toISOString();
    await axios.patch<ITask>(`http://localhost:3001/tasks/${taskId}`, {
      completed: newComplete,
    });
    return {
      id: taskId,
      changes: { completed: newComplete },
    };
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

export const countTasksByFilter = createSelector(
  [selectAllTasks, (state: RootState, filter: string) => filter],
  (tasks, filter) => {
    switch (filter) {
      case Filters.TODAY:
        return tasks.filter(
          (task) => !task.completed && task.date && checkDay(task.date)
        ).length;
      case Filters.INCOMING:
        return tasks.filter((task) => !task.completed).length;
      case Filters.WEEK:
        return tasks.filter(
          (task) => !task.completed && task.date && checkWeek(task.date)
        ).length;
      case Filters.DELETED:
        return tasks.filter((task) => task.deleted).length;
      case Filters.COMPLETED:
        return tasks.filter((task) => task.completed && !task.deleted).length;
      default:
        return tasks.filter(
          (task) =>
            task.tags.includes(filter) && !task.completed && !task.deleted
        ).length;
    }
  }
);

export const selectTaggedTasks = createSelector(
  [selectAllTasks, selectActiveTags],
  (tasks, activeTags) => {
    return activeTags.length
      ? tasks.filter((task) =>
          activeTags.some((tag) => task.tags.includes(tag))
        )
      : tasks;
  }
);

export const selectFilteredTaskIds = createSelector(
  [selectTaggedTasks, selectActiveFilter],
  (tasks, activeFilter) => {
    switch (activeFilter) {
      case Filters.INCOMING:
        const tasksIncoming = new FilterGroup();
        tasks.forEach((task: ITask) => {
          if (task.completed) {
            tasksIncoming.completed.push(task.id);
          } else if (!task.date || checkIncoming(task.date)) {
            tasksIncoming.incoming.push(task.id);
          } else tasksIncoming.overdue.push(task.id);
        });
        return tasksIncoming;

      case Filters.TODAY:
        const tasksToday = new FilterGroup();

        tasks.forEach((task: ITask) => {
          if (
            !task.completed &&
            (!task.date || (checkDay(task.date) && checkIncoming(task.date)))
          ) {
            tasksToday.incoming.push(task.id);
          } else if (checkDay(task.completed)) {
            tasksToday.completed.push(task.id);
          } else if (
            !task.completed &&
            task.date &&
            !checkIncoming(task.date)
          ) {
            tasksToday.overdue.push(task.id);
          }
        });
        return tasksToday;

      case Filters.WEEK:
        const tasksWeek = new FilterGroup();

        tasks.forEach((task: ITask) => {
          if (
            !task.completed &&
            (!task.date || (checkWeek(task.date) && checkIncoming(task.date)))
          ) {
            tasksWeek.incoming.push(task.id);
          } else if (checkWeek(task.completed)) {
            tasksWeek.completed.push(task.id);
          } else if (
            !task.completed &&
            task.date &&
            !checkIncoming(task.date)
          ) {
            tasksWeek.overdue.push(task.id);
          }
        });
        return tasksWeek;

      case Filters.COMPLETED:
        const tasksCompleted = new FilterGroup();
        tasksCompleted.completed = tasks
          .filter((task) => task.completed)
          .map((task) => task.id);
        return tasksCompleted;

      case Filters.DELETED:
        const tasksDeleted = new FilterGroup();
        tasksDeleted.deleted = tasks
          .filter((task) => task.deleted)
          .map((task) => task.id);
        return tasksDeleted;
    }
  }
);

import { configureStore } from '@reduxjs/toolkit';
import filtersSlice from './filtersSlice';
import tasksSlice from './tasksSlice';

const store = configureStore({
  reducer: {
    filters: filtersSlice,
    tasks: tasksSlice,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

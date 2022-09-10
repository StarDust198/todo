import { configureStore } from '@reduxjs/toolkit';
import tagsSlice from './tagsSlice';
import tasksSlice from './tasksSlice';

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    tags: tagsSlice,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

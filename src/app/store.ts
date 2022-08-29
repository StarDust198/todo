import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice';

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

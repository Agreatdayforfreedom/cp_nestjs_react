import { configureStore } from '@reduxjs/toolkit';
import memberSlice from '../features/memberSlice';
import commentSlice from '../features/commentSlice';
import projectSlice from '../features/projectSlice';

export const store = configureStore({
  reducer: {
    memberSlice,
    commentSlice,
    projectSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

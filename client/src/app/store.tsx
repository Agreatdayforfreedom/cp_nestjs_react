import { configureStore } from '@reduxjs/toolkit';
import memberSlice from '../features/members/memberSlice';
import commentSlice from '../features/members/commentSlice';

export const store = configureStore({
  reducer: {
    memberSlice,
    commentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

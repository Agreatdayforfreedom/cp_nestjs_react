import { configureStore } from '@reduxjs/toolkit';
import memberSlice from '../features/members/memberSlice';

export const store = configureStore({
  reducer: {
    memberSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

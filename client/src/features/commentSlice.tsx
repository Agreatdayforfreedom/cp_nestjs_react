import { createSlice } from '@reduxjs/toolkit';
import { NotificationType } from '../interfaces/enums';

interface InitialState {
  id: number;
  content: string;
  editMode: boolean;
}

const initialState: InitialState = {
  id: 0,
  content: '',
  editMode: false,
};

export const commentSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.id = action.payload.id;
      state.content = action.payload.content;
      state.editMode = action.payload.editMode;
    },
    clearState: () => initialState,
  },
});

export const { setState, clearState } = commentSlice.actions;

export default commentSlice.reducer;

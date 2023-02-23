import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  newRequest: boolean;
}

const initialState: InitialState = {
  newRequest: false,
};

export const projectSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.newRequest = action.payload.newRequest;
    },
  },
});

export const { setState } = projectSlice.actions;
export default projectSlice.reducer;

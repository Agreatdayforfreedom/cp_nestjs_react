import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  newRequest: boolean;
  alert: Array<string>;
}

const initialState: InitialState = {
  newRequest: false,
  alert: [],
};

export const projectSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.newRequest = action.payload.newRequest;
    },
    setAlert: (state, action) => {
      if (state.alert.length === 5) state.alert.pop();
      state.alert = [action.payload, ...state.alert];
    },
    quitLastAlert: (state) => {
      state.alert.pop();
    },
  },
});

export const { setState, setAlert, quitLastAlert } = projectSlice.actions;
export default projectSlice.reducer;

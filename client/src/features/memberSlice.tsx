import { createSlice } from '@reduxjs/toolkit';
import { NotificationType } from '../../interfaces/enums';

interface InitialState {
  memberId?: number;
  memberAction?: NotificationType | undefined;
  memberClass?: Lowercase<NotificationType> | undefined;
  removed?: boolean;
}

const initialState: InitialState = {
  memberId: 0,
  memberAction: undefined,
  memberClass: undefined,
  removed: false,
};

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setState: (state, action) => {
      state.memberId = parseInt(action.payload.memberId, 10);
      state.memberAction = action.payload.memberAction;
    },
    setClass: (state, action) => {
      state.memberClass = action.payload.memberClass.toLowerCase();
    },
    setRemoved: (state, action) => {
      state.removed = action.payload;
    },
  },
});

export const { setState, setClass, setRemoved } = memberSlice.actions;

export default memberSlice.reducer;

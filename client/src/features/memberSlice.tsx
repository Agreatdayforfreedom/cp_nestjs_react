import { createSlice } from '@reduxjs/toolkit';
import { Ban, NotificationType } from '../interfaces/enums';

interface InitialState {
  memberId?: number;
  memberAction?: NotificationType | undefined;
  memberClass?: Lowercase<NotificationType> | undefined;
  activateBanStyles?: Ban;
  removed?: boolean;
}

const initialState: InitialState = {
  memberId: 0,
  memberAction: undefined,
  memberClass: undefined,
  activateBanStyles: Ban.UNBANNED,
  removed: false,
};

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    clearState: () => initialState,
    setState: (state, action) => {
      state.memberId = parseInt(action.payload.memberId, 10);
      state.memberAction = action.payload.memberAction;
      state.activateBanStyles = action.payload.activateBanStyles;
    },
    setClass: (state, action) => {
      state.memberClass = action.payload.memberClass.toLowerCase();
    },
    setRemoved: (state, action) => {
      state.removed = action.payload;
    },
  },
});

export const { setState, setClass, setRemoved, clearState } =
  memberSlice.actions;

export default memberSlice.reducer;

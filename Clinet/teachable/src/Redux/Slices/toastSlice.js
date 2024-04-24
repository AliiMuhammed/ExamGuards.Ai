// toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  msg: '',
  type: '',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    openToast(state, action) {
      state.open = true;
      state.msg = action.payload.msg;
      state.type = action.payload.type;
    },
    closeToast(state) {
      state.open = false;
    },
  },
});

export const { openToast, closeToast } = toastSlice.actions;
export default toastSlice.reducer;

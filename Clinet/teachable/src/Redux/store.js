// store.js
import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './Slices/toastSlice';

const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

export default store;

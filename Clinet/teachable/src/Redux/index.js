// index.js
import { combineReducers } from '@reduxjs/toolkit';
import toastReducer from './Slices/toastSlice';

const rootReducer = combineReducers({
  toast: toastReducer,
  // Add other slice reducers here
});

export default rootReducer;

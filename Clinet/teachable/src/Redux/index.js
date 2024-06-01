
import { combineReducers } from '@reduxjs/toolkit';
import toastReducer from './Slices/toastSlice';
import refreshReducer from './Slices/refreshSlice'; 

const rootReducer = combineReducers({
  toast: toastReducer,
  refresh: refreshReducer, 
});

export default rootReducer;

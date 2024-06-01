// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './index'; // Import the combined root reducer

const store = configureStore({
  reducer: rootReducer,
});

export default store;

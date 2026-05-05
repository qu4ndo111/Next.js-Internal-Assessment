import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './features/assessmentsSlice';
// import claimsReducer from './features/claimsSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    // claims: claimsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

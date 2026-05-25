import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './features/assessmentsSlice';
// import claimsReducer from './features/claimsSlice';
import { dashboardApi } from './services/dashboard-api';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    // claims: claimsReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

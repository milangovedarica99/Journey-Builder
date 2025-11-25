import { configureStore } from '@reduxjs/toolkit';

import blueprintReducer from '@/stores/blueprint-slice';

export const store = configureStore({
  reducer: {
    blueprint: blueprintReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

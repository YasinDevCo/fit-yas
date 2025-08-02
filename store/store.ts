import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../slice/profileSlice"; // مسیرت رو تنظیم کن

export const store = configureStore({
  reducer: {
        profile: profileReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

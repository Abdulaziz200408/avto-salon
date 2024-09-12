import { configureStore } from "@reduxjs/toolkit";
import markalarReducer from "./markalarSlice";
import shartnomalarReducer from "./shartnomalarSlice";

export const store = configureStore({
  reducer: {
    markalar: markalarReducer,
    shartnomalar: shartnomalarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { taskStateReducer } from "./slices/TaskState";
import { simplexStateReducer } from "./slices/SimplexState";

export const store = configureStore({
  reducer: {
    taskReducer: taskStateReducer,
    simplexReducer: simplexStateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
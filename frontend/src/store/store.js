import { configureStore } from "@reduxjs/toolkit";

import jobsReducer from "../features/jobs/store/jobsSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getJobs,
  createJob,
  updateJobStatus,
  deleteJob,
} from "../services/jobApi";

// ============================================================
// GET ALL JOBS
// ============================================================

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",

  async (_, thunkAPI) => {
    try {
      const response = await getJobs();

      console.log("GET /jobs RESPONSE:", response);

      return response;
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch jobs",
      );
    }
  },
);

// ============================================================
// CREATE JOB
// ============================================================

export const createJobAsync = createAsyncThunk(
  "jobs/createJob",

  async (jobData, thunkAPI) => {
    try {
      const job = await createJob(jobData);

      console.log("CREATE JOB RESPONSE:", job);

      return job;
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to create job",
      );
    }
  },
);

// ============================================================
// UPDATE JOB STATUS
// ============================================================

export const updateJobStatusAsync = createAsyncThunk(
  "jobs/updateStatus",

  async ({ id, status }, thunkAPI) => {
    try {
      const job = await updateJobStatus(id, status);

      console.log("UPDATE JOB RESPONSE:", job);

      return job;
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to update job status",
      );
    }
  },
);

// ============================================================
// DELETE JOB
// ============================================================

export const deleteJobAsync = createAsyncThunk(
  "jobs/deleteJob",

  async (id, thunkAPI) => {
    try {
      await deleteJob(id);

      return id;
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to delete job",
      );
    }
  },
);

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  jobs: [],

  loading: false,

  creating: false,

  updating: false,

  deleting: false,

  error: null,
};

// ============================================================
// JOB SLICE
// ============================================================

const jobsSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // FETCH JOBS - PENDING
      // ======================================================

      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ======================================================
      // FETCH JOBS - SUCCESS
      // ======================================================

      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.jobs = action.payload;
        } else {
          console.error("Expected jobs array but received:", action.payload);

          state.jobs = [];
        }
      })

      // ======================================================
      // FETCH JOBS - ERROR
      // ======================================================

      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || "Unable to fetch jobs";

        state.jobs = [];
      })

      // ======================================================
      // CREATE JOB - PENDING
      // ======================================================

      .addCase(createJobAsync.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      // ======================================================
      // CREATE JOB - SUCCESS
      // ======================================================

      .addCase(createJobAsync.fulfilled, (state, action) => {
        state.creating = false;

        if (
          action.payload &&
          typeof action.payload === "object" &&
          !Array.isArray(action.payload)
        ) {
          state.jobs.unshift(action.payload);
        } else {
          console.error("Invalid create job response:", action.payload);
        }
      })

      // ======================================================
      // CREATE JOB - ERROR
      // ======================================================

      .addCase(createJobAsync.rejected, (state, action) => {
        state.creating = false;

        state.error = action.payload || "Unable to create job";
      })

      // ======================================================
      // UPDATE STATUS - PENDING
      // ======================================================

      .addCase(updateJobStatusAsync.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      // ======================================================
      // UPDATE STATUS - SUCCESS
      // ======================================================

      .addCase(updateJobStatusAsync.fulfilled, (state, action) => {
        state.updating = false;

        const updatedJob = action.payload;

        if (!updatedJob || typeof updatedJob !== "object") {
          console.error("Invalid update job response:", updatedJob);

          return;
        }

        const index = state.jobs.findIndex((job) => job?.id === updatedJob.id);

        if (index !== -1) {
          state.jobs[index] = updatedJob;
        }
      })

      // ======================================================
      // UPDATE STATUS - ERROR
      // ======================================================

      .addCase(updateJobStatusAsync.rejected, (state, action) => {
        state.updating = false;

        state.error = action.payload || "Unable to update job status";
      })

      // ======================================================
      // DELETE JOB - PENDING
      // ======================================================

      .addCase(deleteJobAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })

      // ======================================================
      // DELETE JOB - SUCCESS
      // ======================================================

      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.deleting = false;

        if (!Array.isArray(state.jobs)) {
          state.jobs = [];
          return;
        }

        state.jobs = state.jobs.filter((job) => job?.id !== action.payload);
      })

      // ======================================================
      // DELETE JOB - ERROR
      // ======================================================

      .addCase(deleteJobAsync.rejected, (state, action) => {
        state.deleting = false;

        state.error = action.payload || "Unable to delete job";
      });
  },
});

export const { clearJobError } = jobsSlice.actions;

export default jobsSlice.reducer;

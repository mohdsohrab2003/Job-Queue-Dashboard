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
      return await getJobs();
    } catch (error) {
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
      return await updateJobStatus(id, status);
    } catch (error) {
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
      // FETCH JOBS
      // ======================================================

      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })

      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================================
      // CREATE JOB
      // ======================================================

      .addCase(createJobAsync.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      .addCase(createJobAsync.fulfilled, (state, action) => {
        state.creating = false;

        state.jobs.unshift(action.payload);
      })

      .addCase(createJobAsync.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // ======================================================
      // UPDATE STATUS
      // ======================================================

      .addCase(updateJobStatusAsync.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      .addCase(updateJobStatusAsync.fulfilled, (state, action) => {
        state.updating = false;

        const updatedJob = action.payload;

        const index = state.jobs.findIndex((job) => job.id === updatedJob.id);

        if (index !== -1) {
          state.jobs[index] = updatedJob;
        }
      })

      .addCase(updateJobStatusAsync.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // ======================================================
      // DELETE JOB
      // ======================================================

      .addCase(deleteJobAsync.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })

      .addCase(deleteJobAsync.fulfilled, (state, action) => {
        state.deleting = false;

        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })

      .addCase(deleteJobAsync.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError } = jobsSlice.actions;

export default jobsSlice.reducer;

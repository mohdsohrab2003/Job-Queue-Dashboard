import apiClient from "../../../services/apiClient";

// ============================================================
// GET ALL JOBS
// ============================================================

export const getJobs = async () => {
  const response = await apiClient.get("/jobs");

  console.log("GET /jobs:", response.data);

  return response.data;
};

// ============================================================
// CREATE JOB
// ============================================================

export const createJob = async (jobData) => {
  const response = await apiClient.post("/jobs", jobData);

  console.log("POST /jobs:", response.data);

  return response.data;
};

// ============================================================
// UPDATE JOB STATUS
// ============================================================

export const updateJobStatus = async (id, status) => {
  const response = await apiClient.patch(`/jobs/${id}/status`, { status });

  console.log(`PATCH /jobs/${id}/status:`, response.data);

  return response.data;
};

// ============================================================
// DELETE JOB
// ============================================================

export const deleteJob = async (id) => {
  const response = await apiClient.delete(`/jobs/${id}`);

  console.log(`DELETE /jobs/${id}:`, response.data);

  return response.data;
};

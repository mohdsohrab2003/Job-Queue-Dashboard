import apiClient from "../../../services/apiClient";

export const getJobs = async () => {
  const response = await apiClient.get("/jobs");

  return response.data;
};

export const createJob = async (jobData) => {
  const response = await apiClient.post("/jobs", jobData);

  return response.data;
};

export const updateJobStatus = async (id, status) => {
  const response = await apiClient.patch(`/jobs/${id}/status`, { status });

  return response.data;
};

export const deleteJob = async (id) => {
  const response = await apiClient.delete(`/jobs/${id}`);

  return response.data;
};

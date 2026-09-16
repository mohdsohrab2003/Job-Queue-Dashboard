import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import JobTable from "../../features/jobs/components/JobTable";
import JobFilters from "../../features/jobs/components/JobFilters";
import { fetchJobs } from "../../features/jobs/store/jobsSlice";

function AllJobs() {
  const dispatch = useDispatch();

  const { jobs = [], loading, error } = useSelector((state) => state.jobs);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return jobs.filter((job) => {
      if (!job) return false;

      const title = String(job.title ?? "");
      const type = String(job.type ?? "");
      const jobStatus = String(job.status ?? "");

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        type.toLowerCase().includes(searchText);

      const matchesStatus = status === "all" || jobStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  return (
    <DashboardLayout>
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            All Jobs
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View and manage all jobs in the queue.
          </p>
        </div>

        {/* Jobs Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Jobs</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredJobs.length} job
                  {filteredJobs.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="w-full lg:max-w-md">
                <JobFilters
                  search={search}
                  setSearch={setSearch}
                  status={status}
                  setStatus={setStatus}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {Array.isArray(error) ? error.join(", ") : error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-sm text-slate-500">Loading jobs...</p>
            </div>
          ) : (
            <JobTable jobs={filteredJobs} />
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}

export default AllJobs;

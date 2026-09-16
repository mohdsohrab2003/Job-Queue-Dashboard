import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";

import JobStats from "../../features/jobs/components/JobStats";
import JobTable from "../../features/jobs/components/JobTable";
import JobFilters from "../../features/jobs/components/JobFilters";
import JobForm from "../../features/jobs/components/JobForm";
import StatusLegend from "../../features/jobs/components/StatusLegend";

import { fetchJobs } from "../../features/jobs/store/jobsSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { jobs, loading, error } = useSelector((state) => state.jobs);

  // ============================================================
  // ALWAYS ENSURE JOBS IS AN ARRAY
  // ============================================================

  const jobsList = Array.isArray(jobs) ? jobs : [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // ============================================================
  // FETCH JOBS
  // ============================================================

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // ============================================================
  // FILTER JOBS
  // ============================================================

  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return jobsList.filter((job) => {
      if (!job || typeof job !== "object") {
        return false;
      }

      const title = String(job.title ?? "");
      const type = String(job.type ?? "");
      const jobStatus = String(job.status ?? "");

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        type.toLowerCase().includes(searchText);

      const matchesStatus = status === "all" || jobStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobsList, search, status]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      <main className="p-4 sm:p-6 lg:p-8">
        {/* ======================================================
            WELCOME
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, John! 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Here's an overview of your job postings.
          </p>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {Array.isArray(error) ? error.join(", ") : String(error)}
          </div>
        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <JobStats />

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* ====================================================
              LEFT - JOB TABLE
          ==================================================== */}

          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
            {/* ==================================================
                TABLE HEADER
            ================================================== */}

            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Title */}

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Jobs
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and monitor your jobs
                  </p>
                </div>

                {/* Filters */}

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

            {/* ==================================================
                JOB TABLE
            ================================================== */}

            {loading ? (
              <div className="flex min-h-60 items-center justify-center">
                <p className="text-sm text-slate-500">Loading jobs...</p>
              </div>
            ) : (
              <JobTable jobs={filteredJobs} />
            )}
          </section>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-6">
            {/* ==================================================
                CREATE JOB
            ================================================== */}

            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Create New Job
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new job to the queue.
                </p>
              </div>

              <JobForm />
            </section>

            {/* ==================================================
                STATUS LEGEND
            ================================================== */}

            <StatusLegend />
          </aside>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Dashboard;

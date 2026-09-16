import JobRow from "./JobRow";

function JobTable({ jobs = [] }) {
  if (jobs.length === 0) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-slate-700">No jobs found</p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or status filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Scrollable Table */}
      <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 bg-slate-50">
              {/* # */}
              <th className="w-[2%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"></th>

              {/* Title */}
              <th className="w-[18%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </th>
              {/* Type */}
              <th className="w-[5%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              {/* Status */}
              <th className="w-[5%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              {/* Created */}
              <th className="w-[10%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created At
              </th>
              {/* Actions */}
              <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, index) => (
              <JobRow key={job?.id ?? `job-${index}`} job={job} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobTable;

import { Circle } from "lucide-react";

const statuses = [
  {
    status: "pending",
    label: "Pending",
    description: "Waiting to run",
    className: "text-amber-500",
  },
  {
    status: "running",
    label: "Running",
    description: "Currently processing",
    className: "text-blue-500",
  },
  {
    status: "completed",
    label: "Completed",
    description: "Successfully finished",
    className: "text-green-500",
  },
  {
    status: "failed",
    label: "Failed",
    description: "Processing failed",
    className: "text-red-500",
  },
];

function StatusLegend() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Status Legend</h3>

      <p className="mt-1 text-sm text-slate-500">Current job status meanings</p>

      <div className="mt-5 space-y-4">
        {statuses.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <Circle size={10} fill="currentColor" className={item.className} />

            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{item.label}</p>

              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusLegend;

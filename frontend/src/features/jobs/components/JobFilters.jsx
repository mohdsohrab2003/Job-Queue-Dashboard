import { Search } from "lucide-react";

import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "running",
    label: "Running",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "failed",
    label: "Failed",
  },
];

function JobFilters({ search, setSearch, status, setStatus }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="
            pointer-events-none absolute left-3
            top-1/2 -translate-y-1/2
            text-slate-400
          "
        />

        <Input
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
          aria-label="Search jobs"
        />
      </div>

      {/* Status */}
      <div className="w-full sm:w-44">
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={STATUS_OPTIONS}
          aria-label="Filter jobs by status"
        />
      </div>
    </div>
  );
}

export default JobFilters;

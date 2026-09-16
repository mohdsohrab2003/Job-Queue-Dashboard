import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

import { useSelector } from "react-redux";

function JobStats() {
  const jobs = useSelector((state) => state.jobs.jobs);

  const total = jobs.length;

  const pending = jobs.filter((job) => job.status === "pending").length;

  const running = jobs.filter((job) => job.status === "running").length;

  const completed = jobs.filter((job) => job.status === "completed").length;

  const failed = jobs.filter((job) => job.status === "failed").length;

  const stats = [
    {
      title: "Total Jobs",
      value: total,
      icon: BriefcaseBusiness,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Running",
      value: running,
      icon: LoaderCircle,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "Failed",
      value: failed,
      icon: CircleAlert,
      iconClass: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              rounded-xl border border-slate-200
              bg-white p-5 shadow-sm
              transition hover:shadow-md
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`
                  flex h-11 w-11 items-center justify-center
                  rounded-lg ${stat.iconClass}
                `}
              >
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default JobStats;

import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import JobForm from "../../features/jobs/components/JobForm";

function CreateJob() {
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

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Create New Job
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Add a new job to the queue.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Job Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the details below to create your job.
              </p>
            </div>

            <JobForm />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default CreateJob;

import { useState } from "react";
import { Check, Play, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

import { deleteJobAsync, updateJobStatusAsync } from "../store/jobsSlice";

import {
  showDeleteConfirm,
  showError,
  showSuccess,
} from "../../../utils/alert";

function JobRow({ job, index }) {
  const dispatch = useDispatch();

  const { updating, deleting } = useSelector((state) => state.jobs);

  const [actionLoading, setActionLoading] = useState(false);

  /*
   * Safe values
   * Prevents undefined.charAt() / undefined.toLowerCase()
   */
  const jobId = job?.id;
  const jobTitle = String(job?.title ?? "");
  const jobType = String(job?.type ?? "");
  const jobStatus = String(job?.status ?? "pending");
  const createdAt = job?.createdAt;

  const isDisabled = actionLoading || updating || deleting;

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const handleStatusChange = async (status) => {
    try {
      setActionLoading(true);

      await dispatch(
        updateJobStatusAsync({
          id: jobId,
          status,
        }),
      ).unwrap();

      const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

      await showSuccess(
        "Job Updated!",
        `The job status has been changed to ${statusLabel}.`,
      );
    } catch (error) {
      showError(
        "Failed to Update Job",
        Array.isArray(error)
          ? error.join(", ")
          : error || "Unable to update job status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async () => {
    const result = await showDeleteConfirm(jobTitle);

    // Cancel
    if (!result.isConfirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await dispatch(deleteJobAsync(jobId)).unwrap();

      await showSuccess(
        "Job Deleted!",
        "The job has been removed successfully.",
      );
    } catch (error) {
      showError(
        "Failed to Delete Job",
        Array.isArray(error)
          ? error.join(", ")
          : error || "Unable to delete job.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ============================================================
  // STATUS ACTION
  // ============================================================

  const getNextAction = () => {
    // ----------------------------------------------------------
    // PENDING
    // ----------------------------------------------------------

    if (jobStatus === "pending") {
      return (
        <Button
          size="sm"
          onClick={() => handleStatusChange("running")}
          disabled={isDisabled}
          className="h-9 w-[80px] justify-center"
        >
          <Play size={14} className="mr-1" />
          Run
        </Button>
      );
    }

    // ----------------------------------------------------------
    // RUNNING
    // ----------------------------------------------------------

    if (jobStatus === "running") {
      return (
        <div className="flex h-9 w-[130px] items-center gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => handleStatusChange("completed")}
            disabled={isDisabled}
            className="h-9 w-[62px] justify-center px-2"
            aria-label="Complete job"
            title="Complete job"
          >
            <Check size={15} />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => handleStatusChange("failed")}
            disabled={isDisabled}
            className="h-9 w-[62px] justify-center px-2"
            aria-label="Fail job"
            title="Fail job"
          >
            <X size={15} />
          </Button>
        </div>
      );
    }

    // ----------------------------------------------------------
    // COMPLETED / FAILED
    // ----------------------------------------------------------

    return (
      <div className="flex h-9 w-[130px] items-center">
        <span className="text-xs text-slate-400">Finished</span>
      </div>
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <tr className="h-[72px] border-b border-slate-100 transition-colors hover:bg-slate-50">
      {/* ======================================================
          NUMBER
      ====================================================== */}

      <td className="px-4 py-4 text-sm font-medium text-slate-500">
        {index + 1}
      </td>

      {/* ======================================================
          TITLE
      ====================================================== */}

      <td className="px-4 py-4">
        <p
          className="max-w-[220px] truncate text-sm font-semibold text-slate-900"
          title={jobTitle}
        >
          {jobTitle || "-"}
        </p>
      </td>

      {/* ======================================================
          TYPE
      ====================================================== */}

      <td className="px-4 py-4">
        <p
          className="max-w-[120px] truncate text-sm text-slate-600"
          title={jobType}
        >
          {jobType || "-"}
        </p>
      </td>

      {/* ======================================================
          STATUS
      ====================================================== */}

      <td className="px-4 py-4">
        <div className="flex h-8 w-[100px] items-center">
          <Badge variant={jobStatus}>
            {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
          </Badge>
        </div>
      </td>

      {/* ======================================================
          CREATED AT
      ====================================================== */}

      <td className="whitespace-nowrap px-4 py-4">
        <p className="text-sm text-slate-600">{formatDate(createdAt)}</p>
      </td>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <td className="px-4 py-4">
        <div className="flex h-9 items-center gap-2">
          {/* Fixed status action area */}
          <div className="flex h-9 w-[130px] items-center">
            {getNextAction()}
          </div>

          {/* Fixed delete button */}
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            disabled={isDisabled || !jobId}
            aria-label={`Delete ${jobTitle}`}
            title="Delete job"
            className="h-9 w-9 shrink-0 justify-center p-0"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default JobRow;

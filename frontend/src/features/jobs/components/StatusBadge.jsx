import Badge from "../../../components/ui/Badge";

const STATUS_LABELS = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;

  return <Badge variant={status}>{label}</Badge>;
}

export default StatusBadge;

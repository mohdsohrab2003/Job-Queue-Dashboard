import Swal from "sweetalert2";

export const showSuccess = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
    confirmButtonColor: "#2563eb",
  });
};

export const showError = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
    confirmButtonColor: "#dc2626",
  });
};
export const showDeleteConfirm = (jobTitle) => {
  return Swal.fire({
    icon: "warning",
    title: "Delete Job?",
    text: `Are you sure you want to delete "${jobTitle}"?`,
    showCancelButton: true,
    confirmButtonText: "Yes, Delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });
};

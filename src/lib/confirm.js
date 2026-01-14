import Swal from "sweetalert2";

export async function confirmAction({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmText = "Yes, do it",
  cancelText = "Cancel",
}) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    confirmButtonColor: "#b45309",
    cancelButtonColor: "#374151",
    background: "#fffbeb",
  });

  return result.isConfirmed;
}

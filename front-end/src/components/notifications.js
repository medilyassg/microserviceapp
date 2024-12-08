import Swal from 'sweetalert2';

const useSweetAlert = () => {

  const showSuccessAlert = async(title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'success',
      });
      return result.isConfirmed;
  };

  const showErrorAlert = async(title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'error',
      });
      return result.isConfirmed;
  };

  const showWarningAlert = async(title, text) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
      });
      return result.isConfirmed;
  };

  const showConfirmationAlert = async (title, text) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    return result.isConfirmed;
  };

  return {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showConfirmationAlert,
  };
};

export default useSweetAlert;

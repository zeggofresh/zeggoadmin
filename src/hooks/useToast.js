import { toast } from 'react-toastify';

/**
 * Custom hook for managing toast notifications using react-toastify
 * @returns {Object} Toast control methods
 */
const useToast = () => {
  const showToast = (message, type = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  };

  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showWarning = (message) => {
    toast.warning(message);
  };

  const showInfo = (message) => {
    toast.info(message);
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;

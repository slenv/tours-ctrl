import { toast } from "sonner";

export const useToast = () => {
  const showPromise = (promise, { loadingText }) => {
    toast.promise(promise, {
      id: 'showPromise',
      loading: loadingText || 'Procesando...',
      success: (message) => message,
      error: (err) => err.message
    });
  }

  const showConfirmPromise = (confirmationText, { onConfirm, loadingText }) => {
    toast(confirmationText, {
      cancel: { label: 'Cancelar' },
      action: {
        label: 'Aceptar',
        onClick: () => {
          toast.promise(onConfirm(), {
            loading: loadingText || 'Procesando...',
            success: (message) => message,
            error: (err) => err.message
          })
        }
      },
    });
  }

  return { showPromise, showConfirmPromise };
}

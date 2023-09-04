import { toast } from 'react-toastify';


export function showErrorToast(content) {
   toast.error(content);
}


export function showSuccessToast(content) {
   toast.success(content);
}


export function showWarningToast(content) {
   toast.warning(content);
}

export function showInfoToast(content) {
   toast.info(content);
}
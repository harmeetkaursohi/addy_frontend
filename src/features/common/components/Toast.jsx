import { toast } from 'react-toastify';


export function showErrorToast(content) {
   toast.isActive("toast") ? toast.update("toast", {
      type: toast.TYPE.ERROR,
      render: content
   }) : toast.error(content, { toastId: "toast" })
}


export function showSuccessToast(content) {

   toast.isActive("toast") ? toast.update("toast", {
      type: toast.TYPE.SUCCESS,
      render: content
   }) : toast.success(content, { toastId: "toast" })
}


export function showWarningToast(content) {
   toast.isActive("toast") ? toast.update("toast", {
      type: toast.TYPE.WARNING,
      render: content
   }) : toast.warning(content, { toastId: "toast" })
}

export function showInfoToast(content) {
   toast.isActive("toast") ? toast.update("toast", {
      type: toast.TYPE.INFO,
      render: content
   }) : toast.info(content, { toastId: "toast" })
}
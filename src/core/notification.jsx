import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react-refresh/only-export-components
export const notifyError = (msg) => toast.error(msg || "Erro!");
// eslint-disable-next-line react-refresh/only-export-components
export const notifySuccess = (msg) => toast.success(msg || "Sucesso!");
// eslint-disable-next-line react-refresh/only-export-components
export const notifyInfo = (msg) => toast.info(msg || "Informação.");

export default function Notification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}


import { Toast, ToastContainer } from "react-bootstrap";

type ToastMessageProps = {
  toastType: "success" | "danger";
  toastMessage: string;
  showToast: boolean;
  onClose: () => void;
}

export default function ToastMessage({ toastType, toastMessage, showToast, onClose }: ToastMessageProps) {
  return (
    <ToastContainer position="top-center">
      <Toast autohide bg={toastType} show={showToast} delay={5000} onClose={onClose}>
        <Toast.Body className='text-white text-center'>{toastMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

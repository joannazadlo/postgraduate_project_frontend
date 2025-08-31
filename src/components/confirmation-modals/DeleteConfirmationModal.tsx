import { Button, Modal } from "react-bootstrap";
import styles from '../styles/ConfirmationModals.module.css'

type DeleteConfirmationModalProps = {
  showModal: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>
}
export default function DeleteConfirmationModal({ showModal, onClose, onDelete }: DeleteConfirmationModalProps) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton className={styles.modalHeaderCustom}>
        <Modal.Title className={styles.modalTitleCustom}>Confirm Recipe Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyCustom}>
        Are you sure you want to delete this recipe? <br /> This action cannot be undone.
      </Modal.Body>
      <Modal.Footer className={styles.modalFooterCustom}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

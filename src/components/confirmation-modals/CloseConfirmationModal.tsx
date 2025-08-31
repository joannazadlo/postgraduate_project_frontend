import { Button, Modal } from 'react-bootstrap';
import styles from '../styles/ConfirmationModals.module.css'

type CloseConfirmationModalProps = {
  show: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

export default function CloseConfirmationModal({
  show,
  onClose,
  onDiscard
} : CloseConfirmationModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton className={styles.modalHeaderCustom}>
        <Modal.Title className={styles.modalTitleCustom}>Close Without Saving?</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyCustom}>
        Are you sure you want to close without saving your changes?
      </Modal.Body>
      <Modal.Footer className={styles.modalFooterCustom}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onDiscard}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

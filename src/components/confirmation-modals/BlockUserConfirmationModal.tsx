import { Button, Modal } from 'react-bootstrap';
import styles from '../styles/ConfirmationModals.module.css'

type BlockUserConfirmationModalProps = {
  showModal: boolean;
  onClose: () => void;
  onBlock: () => Promise<void>
}

export default function BlockUserConfirmationModal({
  showModal,
  onClose,
  onBlock
} : BlockUserConfirmationModalProps) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header  closeButton className={styles.modalHeaderCustom}>
        <Modal.Title className={styles.modalTitleCustom}>Block This User?</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyCustom}>
        Are you sure you want to block this user? <br /> This action cannot be undone.
      </Modal.Body>
      <Modal.Footer className={styles.modalFooterCustom}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onBlock}>
          Block
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

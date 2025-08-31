import { Col, Form, Button } from 'react-bootstrap';
import styles from './ResetPassword.module.css';

type ResetPasswordProps = {
  email: string;
  setEmail: (email: string) => void;
  handleResetPassword: (email: string) => Promise<void>;
  resetMessage?: string | null;
  resetMessageType?: 'success' | 'error' | null;
  onBack: () => void;
}

export default function ResetPasswordForm({
  email,
  setEmail,
  handleResetPassword,
  resetMessage,
  resetMessageType,
  onBack,
}: ResetPasswordProps) {
  return (
    <Col md={6} className="d-flex justify-content-center align-items-center">
      <div className={styles.resetPasswordContainer}>
        <h2 className="mb-4">Reset Password</h2>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword(email);
          }}
        >
          <Form.Group className="mb-3" controlId="formResetEmail">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {resetMessage && (
            <div
              className={`mb-3 ${resetMessageType === 'error' ? 'text-danger' : 'text-success'}`}
            >
              {resetMessage}
            </div>
          )}

          <Button variant="primary" type="submit" className="me-2">
            Send reset link
          </Button>

          <Button variant="secondary" onClick={onBack}>
            Back to Login
          </Button>
        </Form>
      </div>
    </Col>
  );
}

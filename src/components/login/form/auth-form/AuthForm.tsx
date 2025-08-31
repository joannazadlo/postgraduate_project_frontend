import styles from './AuthForm.module.css';
import { Col, Form, Button, Spinner } from 'react-bootstrap';

type AuthFormProps = {
  email: string;
  password: string;
  isSignup: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  handleLogin: () => Promise<void>;
  handleSignUp: () => Promise<void>;
  authError?: string | null;
  setAuthMode: (mode: 'login' | 'signup' | 'reset') => void;
}

export default function AuthForm({
  email,
  password,
  isSignup,
  isSubmitting,
  isLoading,
  setEmail,
  setPassword,
  setIsSignUp,
  handleLogin,
  handleSignUp,
  authError,
  setAuthMode
}: AuthFormProps) {
  return (
    <Col md={6} className="d-flex justify-content-center align-items-center">
      <div className={styles.formContainer}>
        <h2 className="mb-4">{isSignup ? "Sign Up" : "Sign In"}</h2>

        <Form onSubmit={async (e) => {
          e.preventDefault();
          if (isSignup) {
            await handleSignUp();
          } else {
            await handleLogin();
          }
        }}>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {authError && (
            <div className="text-danger mb-3">
              {authError}
            </div>
          )}

          <Button
            variant="primary"
            className="me-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting || isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {isSignup ? "Creating..." : "Logging in..."}
              </>
            ) : (
              isSignup ? "Create Account" : "Login"
            )}
          </Button>

          <Button variant="secondary" onClick={() => setIsSignUp(!isSignup)}>
            {isSignup ? "Switch to Login" : "Switch to Sign Up"}
          </Button>

          {!isSignup && (
            <div className="mt-2">
              <Button
                variant="link"
                className="p-0"
                onClick={() => setAuthMode('reset')}
              >
                Forgot password?
              </Button>
            </div>
          )}
        </Form>
      </div>
    </Col>
  )
}

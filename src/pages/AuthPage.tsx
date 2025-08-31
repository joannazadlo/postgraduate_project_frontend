import { useState } from 'react';
import styles from '../pages/styles/AuthPage.module.css';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
  getAuth,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { getFirebaseIdToken } from '../services/firebaseService';
import { createUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';

import { Container, Row } from 'react-bootstrap';
import PromoSection from '../components/login/promo/PromoSection';
import AuthForm from '../components/login/form/auth-form/AuthForm';
import ResetPasswordForm from '../components/login/form/reset-password-form/ResetPasswordForm';

export default function AuthPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { refreshUser, suppressNextUserFetch } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetMessageType, setResetMessageType] = useState<'success' | 'error' | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      suppressNextUserFetch();
      await signInWithEmailAndPassword(auth, email, password);
      const idToken: string | null = await getFirebaseIdToken();

      if (!idToken) {
        throw new Error('No ID token found');
      }

      await refreshUser();

      navigate('/');
    } catch (err: unknown) {
      const error = err as { code?: string; response?: { status?: number } };

      if (error.response?.status === 403) {
        setAuthError("Your account has been blocked. Please contact support.");
      }

      else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setAuthError("Email or password is incorrect.");
      }
      else {
        setAuthError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      suppressNextUserFetch();
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken: string | null = await getFirebaseIdToken();
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const mappedUser = {
        uid: user.uid,
        email: user.email!
      };

      try {
        await createUser(mappedUser);
        await refreshUser();
      } catch {
        await user.delete();
        setAuthError("Registration failed: we couldn’t sync your data. Please try again later.");
        return;
      }

      navigate('/');
    } catch {
      setAuthError("Registration failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    const auth = getAuth();
    setResetMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("If an account with that email exists, we’ve sent password reset instructions.");
      setResetMessageType('success');
    } catch {
      setResetMessage("Failed to send reset email. Please try again later.");
      setResetMessageType('error');
    }
  };

  const resetStates = () => {
    setAuthError(null);
    setResetMessage(null);
    setResetMessageType(null);
    setPassword('');
  };

  const handleSetAuthMode = (mode: 'login' | 'signup' | 'reset') => {
    resetStates();
    setAuthMode(mode);
  };

  return (
    <Container fluid className={styles.container}>
      <Row className="w-100 h-100 align-items-stretch">
        <PromoSection />

        {authMode === 'reset' ? (
          <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            handleResetPassword={handleResetPassword}
            resetMessage={resetMessage}
            resetMessageType={resetMessageType}
            onBack={() => handleSetAuthMode('login')}
          />

        ) : (
          <AuthForm
            email={email}
            password={password}
            isSignup={authMode === 'signup'}
            isSubmitting={isSubmitting}
            isLoading={isLoading}
            setEmail={setEmail}
            setPassword={setPassword}
            setIsSignUp={(is) => handleSetAuthMode(is ? 'signup' : 'login')}
            handleLogin={handleLogin}
            handleSignUp={handleSignup}
            authError={authError}
            setAuthMode={handleSetAuthMode}
          />
        )}
      </Row>
    </Container>
  );
}

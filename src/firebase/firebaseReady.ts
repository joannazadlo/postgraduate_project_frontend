import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const waitForFirebaseAuth = () => {
  const auth = getAuth();

  return new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe();
      resolve();
    });
  });
};

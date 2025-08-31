import { getAuth } from 'firebase/auth';

export const getFirebaseIdToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      const idToken = await user.getIdToken();
      return idToken;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
  return null;
};

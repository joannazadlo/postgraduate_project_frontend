import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getUserByUid } from '../services/userService';
import { User } from '../types/types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  suppressNextUserFetch: () => void;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  currentUser: null,
  loading: true,
  refreshUser: async () => { },
  suppressNextUserFetch: () => { }
});

export default function AuthProvider({ children } : {children : ReactNode}) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const skipNextFetch = useRef(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setLoading(true);

      if (skipNextFetch.current) {
        skipNextFetch.current = false;
        setLoading(false);
        return;
      }

      if (user) {
        try {
          const userData = await getUserByUid(user.uid);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userData = await getUserByUid(user.uid);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        throw error;
      }
    }
  };

  const suppressNextUserFetch = () => {
    skipNextFetch.current = true;
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, currentUser, loading, refreshUser, suppressNextUserFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

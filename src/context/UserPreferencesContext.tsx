import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getUserPreferences, saveUserPreferences } from '../services/userPreferencesService';
import { UserPreferences } from '../types/types';
import { useAuth } from './AuthContext';
import ToastMessage from '../components/ui/toast/ToastMessage';

interface UserPreferencesContext {
  preferences: UserPreferences | null;
  loading: boolean;
  updatePreferences: (newPreferences: UserPreferences) => Promise<void>;

}
const UserPreferencesContext = createContext<UserPreferencesContext | undefined>(undefined);

export default function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { currentUser, loading: authLoading } = useAuth();

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState<boolean>(false);

  const fetchUserPreferences = async () => {
    setLoading(true);
    try {
      const userPreferences = await getUserPreferences();
      setPreferences(userPreferences);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const updatePreferences = async (newPreferences: UserPreferences) => {
    try {
      await saveUserPreferences(newPreferences);
      setPreferences(newPreferences);
      setToastMessage('Preferences saved successfully');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.log(error);
      setToastMessage('Failed to save preferences');
      setToastType('danger');
      setShowToast(true);
    }
  }

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUserPreferences();
    } else if (!authLoading && !currentUser) {
      setPreferences(null);
    }
  }, [currentUser, authLoading]);

  return (
    <UserPreferencesContext.Provider value={{ preferences, loading, updatePreferences }}>
      {children}

      {showToast && (
        <ToastMessage
          toastType={toastType}
          toastMessage={toastMessage}
          showToast={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </UserPreferencesContext.Provider>
  )
}

export const useUserPreferencesContext = (): UserPreferencesContext => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferencesContext must be used within a UserPreferencesProvider');
  }
  return context;
};

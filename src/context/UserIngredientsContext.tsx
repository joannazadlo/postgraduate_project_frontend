import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getUserIngredients, addIngredient, deleteIngredient } from '../services/userIngredientsService';
import { UserIngredient, UserIngredientPayload } from '../types/types';

interface UserIngredientsContext {
  userIngredients: UserIngredient[];
  loading: boolean;
  addUserIngredient: (newIngredient: UserIngredientPayload) => Promise<void>;
  deleteUserIngredient: (id: string) => Promise<void>;
}

const UserIngredientsContext = createContext<UserIngredientsContext | undefined>(undefined);

export default function UserIngredientsProvider({ children }: { children: ReactNode }) {
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserIngredients = async () => {
    setLoading(true);
    try {
      const ingredients = await getUserIngredients();
      setUserIngredients(ingredients);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const addUserIngredient = async (newIngredient: UserIngredientPayload) => {
    try {
      await addIngredient(newIngredient);
      await fetchUserIngredients();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteUserIngredient = async (id: string) => {
    try {
      await deleteIngredient(id);
      await fetchUserIngredients();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserIngredients();
  }, []);

  return (
    <UserIngredientsContext.Provider value={{ userIngredients, loading, addUserIngredient, deleteUserIngredient }}>
      {children}

    </UserIngredientsContext.Provider>
  )
}

export const useUserIngredientsContext = (): UserIngredientsContext => {
  const context = useContext(UserIngredientsContext);
  if (!context) {
    throw new Error('useUserIngredientsContext must be used within a UserIngredientsProvider');
  }
  return context;
}

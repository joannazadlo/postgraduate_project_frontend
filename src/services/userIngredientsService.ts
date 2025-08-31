import apiService from "./apiService";
import { UserIngredient, UserIngredientPayload } from "../types/types";

export const getUserIngredients = async (): Promise<UserIngredient[]> => {
  try {
    const response = await apiService.get<UserIngredient[]>('/ingredients');
    return response.data;
  } catch {
    throw new Error('Error fetching user ingredients');
  }
}

export const addIngredient = async (ingredient: UserIngredientPayload) => {
  try {
    const response = await apiService.post('/ingredients', ingredient);
    return response.data;
  } catch {
    throw new Error("Error adding ingredient");
  }
}

export const deleteIngredient = async (id: string) => {
  try {
    await apiService.delete(`/ingredients/${id}`);
  } catch {
    throw new Error("Error deleting ingredient");
  }
}

import { Opinion, RecipeRating } from "../types/types";
import apiService from "./apiService";

export const getRecipeRating = async (recipeSource: string, recipeId: string): Promise<RecipeRating> => {
  try {
    const response = await apiService.get<RecipeRating>(`/opinions/${recipeSource}/${recipeId}`)
    return response.data;
  } catch {
    throw new Error('Error fetching recipe rating');
  }
}

export const saveOpinion = async ({ recipeSource, recipeId, opinion } : { recipeSource: string, recipeId: string, opinion: Opinion }): Promise<RecipeRating | null> => {
  try {
    const response = await apiService.put<RecipeRating>(`/opinions/${recipeSource}/${recipeId}`, opinion);
    return response.data;
  } catch {
    throw new Error("Error saving opinion");
  }
}

export const deleteOpinion = async ({ recipeSource, recipeId }:{ recipeId: string; recipeSource: string }): Promise<RecipeRating | null> => {
  try {
    const response = await apiService.delete<RecipeRating>(`/opinions/${recipeSource}/${recipeId}`);
    return response.data;
  } catch {
    throw new Error("Error deleting opinion");
  }
}

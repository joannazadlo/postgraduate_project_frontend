import { AdminRecipe, Recipe, RecipePayload } from "../types/types";
import apiService from "./apiService";
import { isAxiosError } from "axios";

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await apiService.get<Recipe[]>('/recipes');
    return response.data;
  } catch {
    throw new Error('Error fetching recipes');
  }
};

export const getAllUsersRecipes = async (): Promise<AdminRecipe[]> => {
  try {
    const response = await apiService.get<AdminRecipe[]>('/admin/recipes');
    return response.data;
  } catch {
    throw new Error('Error fetching recipes');
  }
};

export const createRecipe = async (recipe: RecipePayload) => {
  try {
    const response = await apiService.post('/recipes', recipe);
    return response.data;
  } catch {
    throw new Error('Error adding recipe');
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await apiService.get<Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Recipe not found');
  }
};

export const updateRecipe = async (id: string, updatedRecipe: RecipePayload): Promise<Recipe> => {
  try {
    const response = await apiService.put<Recipe>(`/recipes/${id}`, updatedRecipe);
    return response.data;
  } catch {
    throw new Error('Failed to update recipe');
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    await apiService.delete(`/recipes/${id}`)
  } catch {
    throw new Error('Error deleting recipe');
  }
}

export const createRecipeWithImage = async (
  recipe: RecipePayload,
  imageFile: File
) => {
  try {
    const formData = new FormData();

    const recipeBlob = new Blob(
      [JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        dietaryPreferences: recipe.dietaryPreferences,
        cuisine: recipe.cuisine,
        cookingTime: recipe.cookingTime,
        isPublic: recipe.isPublic
      })],
      { type: 'application/json' }
    );

    formData.append('recipe', recipeBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await apiService.post(`recipes/image`, formData);

    return response.data;
  } catch {
    throw new Error('Error uploading recipe with image');
  }
};

export const updateRecipeWithImage = async (
  id: string,
  updatedRecipe: RecipePayload,
  imageFile?: File,
  imageRemoved: boolean = false
) => {
  try {
    const formData = new FormData();

    const recipeBlob = new Blob(
      [JSON.stringify({
        title: updatedRecipe.title,
        ingredients: updatedRecipe.ingredients,
        steps: updatedRecipe.steps,
        dietaryPreferences: updatedRecipe.dietaryPreferences,
        cuisine: updatedRecipe.cuisine,
        cookingTime: updatedRecipe.cookingTime,
        isPublic: updatedRecipe.isPublic
      })],
      { type: 'application/json' }
    );
    formData.append('recipe', recipeBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (imageRemoved) {
      formData.append('imageRemoved', 'true');
    }

    const response = await apiService.put(`/recipes/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch {
    throw new Error('Error updating recipe with image');
  }
};

export const getMealDbRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await apiService.get<Recipe>(`/mealdb/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Recipe not found');
  }
};

export const getTastyRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await apiService.get<Recipe>(`/tasty/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Recipe not found');
  }
};

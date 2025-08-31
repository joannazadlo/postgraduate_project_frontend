import { AdminRecipe, Recipe, RecipeSearchFilters } from "../types/types";
import apiService from "./apiService";
import qs from 'qs';

const getFilteredRecipes = async <T>(filters: RecipeSearchFilters, url: string): Promise<T[]> => {
  try {
    const params = {
      ...filters,
    };

    if (!params.ingredients || params.ingredients.length === 0) {
      delete params.ingredients;
    }
    if (!params.cuisine) delete params.cuisine;
    if (!params.dietaryPreferences || params.dietaryPreferences.length === 0) {
      delete params.dietaryPreferences;
    }
    if (params.isPublic === undefined || params.isPublic === null) {
      delete params.isPublic;
    }
    if (!params.source) delete params.source;

    const response = await apiService.get<T[]>(url, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    });

    return response.data;
  } catch {
    throw new Error('Error fetching recipes');
  }
}

export const getRecipesFromAllSources = async (filters: RecipeSearchFilters): Promise<Recipe[]> => {
  return getFilteredRecipes(filters, '/recipes/search');
}

export const getFilteredRecipesForUser = async (filters: RecipeSearchFilters): Promise<Recipe[]> => {
  return getFilteredRecipes(filters, '/recipes');
}

export const getFilteredRecipesForAdmin = async (filters: RecipeSearchFilters): Promise<AdminRecipe[]> => {
  return getFilteredRecipes(filters, '/admin/recipes');
}

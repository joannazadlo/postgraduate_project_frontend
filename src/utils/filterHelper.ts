import { RecipeSearchFilters } from "../types/types";

export const filtersToQueryString = (filters: RecipeSearchFilters): string => {
  const queryParams = new URLSearchParams();

  if (filters.ingredients && filters.ingredients.length > 0) {
    queryParams.set('ingredients', filters.ingredients.join(','));
  }
  if (filters.cuisine) queryParams.set('cuisine', filters.cuisine);

  if (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) {
    queryParams.set('dietaryPreferences', filters.dietaryPreferences.join(','));
  }
  if (filters.isPublic !== undefined) queryParams.set('isPublic', String(filters.isPublic));

  if (filters.source) queryParams.set('source', filters.source);

  if (filters.excludeDisliked === true) {
    queryParams.set('excludeDisliked', 'true');
  }

  return queryParams.toString();
};

export const parseFiltersFromLocation = (queryString: string): RecipeSearchFilters => {
  const queryParams = new URLSearchParams(queryString);
  const filters: RecipeSearchFilters = {};

  filters.ingredients = queryParams.get('ingredients') ? queryParams.get('ingredients')!.split(',') : [];
  filters.cuisine = queryParams.get('cuisine') || '';
  filters.dietaryPreferences = queryParams.get('dietaryPreferences') ? queryParams.get('dietaryPreferences')!.split(',') : [];

  const isPublicStr = queryParams.get('isPublic');
  filters.isPublic = isPublicStr === null ? undefined : isPublicStr === 'true';

  filters.source = queryParams.get('source') || '';

  const excludeDislikedStr = queryParams.get('excludeDisliked');
  filters.excludeDisliked = excludeDislikedStr === null ? undefined : excludeDislikedStr === 'true';

  return filters;
};

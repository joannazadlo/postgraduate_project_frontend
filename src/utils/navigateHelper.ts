import { NavigateFunction } from 'react-router-dom';
import { filtersToQueryString } from './filterHelper';
import { RecipeSearchFilters } from '../types/types';

interface NavigateOptions {
  message?: string;
  type?: 'success' | 'error';
  extraState?: Record<string, unknown>;
}

const navigateTo = (
  url: string,
  navigate: NavigateFunction,
  currentPage: number,
  filters?: RecipeSearchFilters,
  options?: NavigateOptions
) => {
  const { message = '', type = 'success', extraState = {} } = options || {};

  const params = new URLSearchParams(filtersToQueryString(filters || {}));

  if (currentPage > 1) {
    params.set('page', currentPage.toString());
  }

  const query = params.toString();
  const path = query ? `${url}?${query}` : url;

  navigate(path, {
    state: {
      toastMessage: message,
      toastType: type,
      ...extraState
    },
  });
};

export const navigateToRecipesPage = (
  navigate: NavigateFunction,
  currentPage: number,
  filters?: RecipeSearchFilters,
  options?: NavigateOptions
) => {
  navigateTo('/', navigate, currentPage, filters, options);
};

export const navigateToAllUsersRecipesPage = (
  navigate: NavigateFunction,
  currentPage: number,
  filters?: RecipeSearchFilters,
  options?: NavigateOptions
) => {
  navigateTo('/admin-recipes', navigate, currentPage, filters, options);
};

export const navigateToSearchRecipesPage = (
  navigate: NavigateFunction,
  currentPage: number,
  filters?: RecipeSearchFilters,
  options?: NavigateOptions
) => {
  navigateTo('/search-recipes', navigate, currentPage, filters, options);
};

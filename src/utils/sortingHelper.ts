import { Recipe, AdminRecipe } from '../types/types';

export type SortOption = 'title-asc' | 'title-desc' | 'date-newest' | 'date-oldest';

export function sortRecipes<T extends Recipe | AdminRecipe>(
  recipes: T[],
  sortOption: SortOption
): T[] {
  return [...recipes].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date-oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });
}

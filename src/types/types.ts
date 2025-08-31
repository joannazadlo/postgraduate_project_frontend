export interface Ingredient {
  id: string | number;
  name: string;
  quantity: string;
}

export interface IngredientPayload {
  id?: number;
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  imageSource: string | null;
  ingredients: Ingredient[];
  steps: string[];
  dietaryPreferences?: string[];
  cuisine?: string;
  cookingTime?: string;
  isPublic?: boolean;
  source: string;
  createdAt: string;
}

export interface RecipePayload {
  title: string;
  ingredients: IngredientPayload[];
  steps: string[];
  dietaryPreferences?: string[];
  cuisine?: string;
  cookingTime?: string;
  isPublic?: boolean;
}

export interface AdminRecipe extends Recipe {
  userEmail: string;
}

export interface User {
  uid: string;
  email: string | null;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BLOCKED';
}

export interface RecipeSearchFilters {
  ingredients?: string[];
  cuisine?: string;
  dietaryPreferences?: string[];
  isPublic?: boolean;
  source?: string;
  excludeDisliked?: boolean;
}

export interface UserPreferences {
  preferredIngredients?: string[];
  cuisine?: string;
  dietaryPreferences?: string[];
  excludeDisliked?: boolean;
}

export interface UserIngredient {
  id: string;
  ingredient: string;
}

export interface UserIngredientPayload {
  ingredient: string;
}

export interface RecipeRating {
  recipeId: string;
  recipeSource: string;
  likes: number;
  dislikes: number;
  neutral: number;
  userOpinion: 'like' | 'dislike' | 'neutral' | null;
}

export interface Opinion {
  userOpinion: 'like' | 'dislike' | 'neutral' | null;
}

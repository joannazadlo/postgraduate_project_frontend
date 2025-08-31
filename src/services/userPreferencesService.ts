import apiService from "./apiService";
import { UserPreferences } from "../types/types";

export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const response = await apiService.get<UserPreferences>('/preferences');
    return response.data;
  } catch {
    throw new Error('Error fetching user preferences');
  }
};

export const saveUserPreferences = async (userPreferences: UserPreferences) => {
  try {
    const response = await apiService.put('/preferences', userPreferences);
    return response.data;
  } catch {
    throw new Error('Error saving user preferences');
  }
};

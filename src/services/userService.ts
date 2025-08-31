import { AxiosError } from "axios";
import { User } from "../types/types";
import apiService from "./apiService";

export const createUser = async (user: { uid: string; email: string; }): Promise<void> => {
  try {
    await apiService.post('/users', {
      uid: user.uid,
      email: user.email
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response?.status === 409) {
      console.warn('User already exists!');
    } else {
      console.error('Error creating user:', axiosError.response?.data?.message ?? axiosError.message);
    }

    throw axiosError;
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiService.get<User[]>('/users');
    return response.data;
  } catch {
    throw new Error('Error fetching users');
  }
};

export const blockUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiService.patch<User>(`/users/${userId}/status`, {
      status: "BLOCKED"
    });
    return response.data;
  } catch {
    throw new Error('Error blocking user');
  }
};

export const getUserByUid = async (uid: string): Promise<User> => {
  const response = await apiService.get(`/users/${uid}`);
  return response.data;
};

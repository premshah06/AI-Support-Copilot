import { apiClient as axios } from './client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // OAuth2 password flow requires form data
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axios.post<LoginResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axios.get<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const listUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>('/users');
  return response.data;
};

export const getUser = async (userId: number): Promise<User> => {
  const response = await axios.get<User>(`/users/${userId}`);
  return response.data;
};

export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const response = await axios.post<User>('/auth/register', {
    ...userData,
    role: 'agent', // Default role for new signups
  });
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<User> => {
  const response = await axios.post<User>('/auth/register', userData);
  return response.data;
};

export const updateUser = async (
  userId: number,
  updates: Partial<{
    name: string;
    email: string;
    role: string;
    password: string;
    is_active: boolean;
  }>
): Promise<User> => {
  const response = await axios.patch<User>(`/users/${userId}`, updates);
  return response.data;
};

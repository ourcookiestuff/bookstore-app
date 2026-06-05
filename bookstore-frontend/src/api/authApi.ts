import axiosClient from './axiosClient';

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/login', data);
  return response.data;
};
import api from './api';

interface LoginRequest {
  username: string;
  password: string;
}

interface AccountRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

interface AuthResponse {
  token: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (data: AccountRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', {
    username: data.username,
    password: data.password,
    email: data.email,
    phone: data.phone
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
}; 
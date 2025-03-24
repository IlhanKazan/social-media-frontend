import api from './api';
import { Account } from '../types';

interface TokenPayload {
  sub: string;
  role: string;
  phone: string;
  email: string;
}

interface TokenInfo {
  accountId: number;
  role: string;
  phone: string;
  email: string;
}

const decodeToken = (token: string): TokenPayload => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  const decodedPayload = JSON.parse(jsonPayload);
  return decodedPayload;
};

export const getCurrentAccount = async (): Promise<Account> => {
  const token = localStorage.getItem('token') || '';
  const decoded = decodeToken(token);
  const accountId = parseInt(decoded.sub);
  const response = await api.get<Account>(`/account/web-get-by-id/${accountId}`);
  return response.data;
};

export const getYourAccount = async (): Promise<Account> => {
  const token = localStorage.getItem('token') || '';
  const decoded = decodeToken(token);
  const accountId = parseInt(decoded.sub);
  const response = await api.get<Account>(`/account/get-by-id/${accountId}`);
  return response.data;
};

export const getYourTokenInfo = (): TokenInfo => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token bulunamadı');
  }
  
  const decoded = decodeToken(token);
  
  // Gerekli alanların varlığını kontrol et
  if (!decoded.sub || !decoded.role || !decoded.phone || !decoded.email) {
    throw new Error('Token eksik bilgiler içeriyor');
  }

  return {
    accountId: parseInt(decoded.sub),
    role: decoded.role,
    phone: decoded.phone,
    email: decoded.email
  };
};

export const getAccountById = async (id: number): Promise<Account> => {
  const response = await api.get<Account>(`/account/get-by-id/${id}`);
  return response.data;
};

export const getAccountByUsername = async (username: string): Promise<Account> => {
  const response = await api.get<Account>(`/account/get-by-username/${username}`);
  return response.data;
};


export const getAllAccounts = async (): Promise<Account[]> => {
  const response = await api.get<Account[]>('/account/get-all');
  return response.data;
};

export const updateAccount = async (data: Partial<Account> & { password?: string }): Promise<Account> => {
  const response = await api.post<Account>('/account/update', data);
  return response.data;
}; 
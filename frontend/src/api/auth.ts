import { apiClient } from './index';
import { RegisterData, LoginData } from '../types/auth';

export const login = (credentials: LoginData) => {
    return apiClient('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const register = (userData: RegisterData) => {
    return apiClient('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};
import { apiClient } from './index';
import { AdminUser, Partner } from '../types/admin';

// Stats
export const getDashboardStats = () => apiClient('/admin/stats');

// User Management
export const getAllUsers = () => apiClient('/admin/users');
export const createUser = (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin' | 'analysisCount' | 'riskLevel'>) =>
    apiClient('/admin/users', { method: 'POST', body: JSON.stringify(userData) });
export const updateUser = (id: string, userData: Partial<AdminUser>) =>
    apiClient(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
export const deleteUser = (id: string) => apiClient(`/admin/users/${id}`, { method: 'DELETE' });

// Partner Management
export const getAllPartners = () => apiClient('/admin/partners');
export const createPartner = (partnerData: Omit<Partner, 'id' | 'createdAt'>) =>
    apiClient('/admin/partners', { method: 'POST', body: JSON.stringify(partnerData) });
export const updatePartner = (id: string, partnerData: Partial<Partner>) =>
    apiClient(`/admin/partners/${id}`, { method: 'PUT', body: JSON.stringify(partnerData) });
export const deletePartner = (id: string) => apiClient(`/admin/partners/${id}`, { method: 'DELETE' });

export const exportUsers = async () => {
    const authData = localStorage.getItem('authData');
    const token = authData ? JSON.parse(authData).token : null;
    
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5000'}/admin/users/export`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to export user data.');
    }

    // Handle the file download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv'; // The filename for the download
    document.body.appendChild(a);
    a.click();
    a.remove(); // Clean up the temporary link
    window.URL.revokeObjectURL(url);
};
export const getRecentActivity = () => apiClient('/admin/activity/recent');

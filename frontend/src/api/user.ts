import { apiClient } from './index';

export const getHistory = () => apiClient('/history');

export const updateProfile = (profileData: { firstName: string, lastName: string, email: string }) => {
    return apiClient('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
};

export const changePassword = (passwordData: any) => {
    return apiClient('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    });
};

export const uploadAvatar = async (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return apiClient('/profile/avatar', {
        method: 'POST',
        body: formData,
    });
};
export const exportHistory = async () => {
    // We can't use the generic apiClient because it expects JSON.
    // We need to handle a file blob response.
    const authData = localStorage.getItem('authData');
    const token = authData ? JSON.parse(authData).token : null;

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5000'}/history/export`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to export history data.');
    }

    // This logic triggers the browser's file download prompt
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognivoice_history.csv'; // The filename for the download
    document.body.appendChild(a);
    a.click();
    a.remove(); // Clean up the temporary link
    window.URL.revokeObjectURL(url);
};
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5000';

// Central API fetching function
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const authData = localStorage.getItem('authData');
    const token = authData ? JSON.parse(authData).token : null;

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
    }

    const config: RequestInit = { ...options, headers };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `Server responded with status ${response.status}`,
        }));
        throw new Error(errorData.message || 'An unknown API error occurred.');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
};
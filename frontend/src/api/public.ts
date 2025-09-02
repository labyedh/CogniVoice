import { apiClient } from './index';

export const getPublicPartners = () => apiClient('/partners');

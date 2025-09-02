import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, Partner, DashboardStats, AdminContextType,ActivityItem } from '../types/admin';
import { useAuth } from './AuthContext';
import * as adminApi from '../api/admin';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalAnalyses: 0, riskDistribution: { low: 0, moderate: 0, high: 0 }, dailyUsage: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]); // Add new state for activity

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, partnersData, statsData,activityData] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllPartners(),
        adminApi.getDashboardStats(),
        adminApi.getRecentActivity(),
      ]);
      setUsers(usersData);
      setPartners(partnersData);
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const createUser = async (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin' | 'analysisCount' | 'riskLevel'>) => {
    await adminApi.createUser(userData);
    await fetchData();
  };

  const updateUser = async (id: string, userData: Partial<AdminUser>) => {
    await adminApi.updateUser(id, userData);
    await fetchData();
  };

  const deleteUser = async (id: string) => {
    await adminApi.deleteUser(id);
    await fetchData();
  };

  const createPartner = async (partnerData: Omit<Partner, 'id' | 'createdAt'>) => {
    await adminApi.createPartner(partnerData);
    await fetchData();
  };

  const updatePartner = async (id: string, partnerData: Partial<Partner>) => {
    await adminApi.updatePartner(id, partnerData);
    await fetchData();
  };

  const deletePartner = async (id: string) => {
    await adminApi.deletePartner(id);
    await fetchData();
  };

  const refreshStats = async () => fetchData();

  const value: AdminContextType = {
    users, partners, stats,activity,
    createUser, updateUser, deleteUser, createPartner, updatePartner, deletePartner, refreshStats,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
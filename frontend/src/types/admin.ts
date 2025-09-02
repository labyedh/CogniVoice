export interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    lastLogin?: string;
    analysisCount: number;
    riskLevel?: 'low' | 'moderate' | 'high';
    isActive: boolean;
  }
  
  export interface Partner {
    id: string;
    name: string;
    type: string;
    description: string;
    logo: string;
    website?: string;
    contactEmail?: string;
    isActive: boolean;
    createdAt: string;
  }
  
  export interface DashboardStats {
    totalUsers: number;
    totalAnalyses: number;
    riskDistribution: {
      low: number;
      moderate: number;
      high: number;
    };
    dailyUsage: Array<{
      date: string;
      analyses: number;
      users: number;
    }>;
  }
  export interface ActivityItem {
    type: 'registration' | 'analysis';
    id: string;
    user_name: string;
    timestamp: string;
    details: string;
    risk_level: 'low' | 'moderate' | 'high' | null;
  }
  export interface AdminContextType {
    users: AdminUser[];    
    partners: Partner[];
    stats: DashboardStats;
    activity: ActivityItem[];
    createUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<void>;
    updateUser: (id: string, user: Partial<AdminUser>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    createPartner: (partner: Omit<Partner, 'id' | 'createdAt'>) => Promise<void>;
    updatePartner: (id: string, partner: Partial<Partner>) => Promise<void>;
    deletePartner: (id: string) => Promise<void>;
    refreshStats: () => Promise<void>;
  }
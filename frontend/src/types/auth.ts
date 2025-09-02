export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    avatarUrl?: string | null ; 

  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    updateUserContext: (updatedUserData: Partial<User>) => void; // <-- THIS LINE IS REQUIRED
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
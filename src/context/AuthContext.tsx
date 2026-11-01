import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginTrainer: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchRoleDemo: (role: UserRole) => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  super_admin: {
    id: 'admin-master-1',
    name: 'TETRA Super Admin',
    email: 'admin@tetra.com.bd',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    designation: 'Managing Director & Institute Head',
    phone: '+880 1712-345678',
    createdAt: '2026-01-01',
  },
  trainer: {
    id: 'trainer-1',
    name: 'Shariar Islam Sohel',
    email: 'trainer@tetra.com.bd',
    role: 'trainer',
    avatar: '/assets/extracted/trainer-1.png',
    designation: 'Digital Marketing & AI Automation Specialist',
    phone: '+880 1812-987654',
    createdAt: '2026-01-15',
  },
  student: {
    id: 'student-demo-1',
    name: 'Tanvir Hossain',
    email: 'student@tetra.com.bd',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    designation: 'Active Learner',
    phone: '+880 1912-445566',
    createdAt: '2026-02-10',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tetra_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tetra_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tetra_auth_user');
    }
  }, [user]);

  const login = async (email: string, _pass: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);

    if (email.includes('admin')) {
      const adminUser = DEMO_USERS.super_admin;
      setUser(adminUser);
      return { success: true };
    }
    if (email.includes('trainer')) {
      const trainerUser = DEMO_USERS.trainer;
      setUser(trainerUser);
      return { success: true };
    }

    const studentUser: UserProfile = {
      id: 'student-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    };
    setUser(studentUser);
    return { success: true };
  };

  const loginTrainer = async (email: string, _pass: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    // Trainer credentials check
    const trainerUser = { ...DEMO_USERS.trainer, email: email || 'trainer@tetra.com.bd' };
    setUser(trainerUser);
    return { success: true };
  };

  const loginAdmin = async (email: string, _pass: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    const adminUser = { ...DEMO_USERS.super_admin, email: email || 'admin@tetra.com.bd' };
    setUser(adminUser);
    return { success: true };
  };

  const register = async (name: string, email: string, _pass: string, phone?: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);

    const newUser: UserProfile = {
      id: 'student-' + Date.now(),
      name,
      email,
      phone,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const switchRoleDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginTrainer,
        loginAdmin,
        register,
        logout,
        updateProfile,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

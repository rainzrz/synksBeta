
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<{ error: any }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        setUser(response.data);
        setSession({ access_token: localStorage.getItem('token') || '' });
      } else {
        // Token is invalid, clear it
        apiClient.clearToken();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      apiClient.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const response = await apiClient.register(email, password, name);
    
    if (response.error) {
      toast.error(response.error);
      return { error: response.error };
    }

    if (response.data) {
      apiClient.setToken(response.data.token);
      // After setting token, load complete profile data
      await loadUserProfile();
      navigate('/dashboard');
      toast.success('Conta criada com sucesso!');
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    
    if (response.error) {
      toast.error(response.error);
      return { error: response.error };
    }

    if (response.data) {
      apiClient.setToken(response.data.token);
      // After setting token, load complete profile data including avatar_url
      await loadUserProfile();
      navigate('/dashboard');
      toast.success('Login realizado com sucesso!');
    }

    return { error: null };
  };

  const signOut = async () => {
    apiClient.clearToken();
    setUser(null);
    setSession(null);
    navigate('/');
    toast.success('Logout realizado com sucesso!');
  };

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    const response = await apiClient.updateProfile(updates);
    
    if (response.error) {
      toast.error('Erro ao atualizar perfil');
      return { error: response.error };
    }

    if (response.data) {
      setUser(response.data);
      toast.success('Perfil atualizado com sucesso!');
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

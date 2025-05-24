
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ? 
          {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata.name || currentSession.user.email?.split('@')[0] || '',
            role: currentSession.user.user_metadata.role || "viewer",
            avatar: currentSession.user.user_metadata.avatar,
            phone: currentSession.user.user_metadata.phone,
            bio: currentSession.user.user_metadata.bio,
          } : null
        );
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? 
        {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          name: currentSession.user.user_metadata.name || currentSession.user.email?.split('@')[0] || '',
          role: currentSession.user.user_metadata.role || "viewer",
          avatar: currentSession.user.user_metadata.avatar,
          phone: currentSession.user.user_metadata.phone,
          bio: currentSession.user.user_metadata.bio,
        } : null
      );
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success("Login bem-sucedido!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "viewer",
          },
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = { 
      email: "guest@synks.com", 
      name: "Convidado", 
      role: "viewer" as const 
    };
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
    toast.success("Login como convidado");
    navigate("/dashboard");
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/login");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      // First update the local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Then update in Supabase if we have a real user (not guest)
      if (session?.user) {
        supabase.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            ...data
          }
        }).then(({ error }) => {
          if (error) {
            toast.error("Falha ao atualizar perfil: " + error.message);
          }
        });
      } else {
        // For guest users, just update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      signup,
      loginAsGuest,
      logout, 
      isAuthenticated: !!user,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

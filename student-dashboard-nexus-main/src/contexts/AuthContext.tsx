import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("AuthProvider rendering"); // Debug log
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener"); // Debug log
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.email); // Debug log
      setUser(user);
      setLoading(false);
      if (user) {
        navigate('/students');
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email); // Debug log
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
    } catch (error: any) {
      console.error("Login error:", error); // Debug log
      let errorMessage = "Invalid credentials";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found. Please check your email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout"); // Debug log
      await signOut(auth);
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error); // Debug log
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
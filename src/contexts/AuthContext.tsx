
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Extended User type with profile-related fields
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  coverUrl?: string;
  followers?: number;
  following?: number;
  likes?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Convert Supabase user to our User type
  const formatUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
    if (!supabaseUser) return null;

    // Fetch the user's profile from our profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      };
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile.username || supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      avatar: profile.avatar_url,
      bio: profile.bio,
      coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Default cover image
      followers: profile.followers,
      following: profile.following,
      likes: profile.likes,
    };
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get the initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const formattedUser = await formatUser(session.user);
        setUser(formattedUser);
      }
      
      setIsLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_, session) => {
          setIsLoading(true);
          if (session) {
            const formattedUser = await formatUser(session.user);
            setUser(formattedUser);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );
      
      // Cleanup function
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const formattedUser = await formatUser(data.user);
      setUser(formattedUser);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back${formattedUser?.name ? ', ' + formattedUser.name : ''}!`,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: `Welcome, ${name}!`,
      });
      
      const formattedUser = await formatUser(data.user);
      setUser(formattedUser);
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
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

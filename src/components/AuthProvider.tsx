
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a #access_token in the URL (from email confirmation)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      console.log('Access token found in URL, setting session');
      // This means the user came from an email confirmation link
      // We'll set up the auth listener and Supabase will handle the token
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        
        // If the user just signed in and we have a session, ensure their profile exists
        if (event === 'SIGNED_IN' && session?.user) {
          ensureProfileExists(session.user.id);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got session:', session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      
      // If we have a session, ensure the user's profile exists
      if (session?.user) {
        ensureProfileExists(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to ensure a profile exists for the user
  const ensureProfileExists = async (userId: string) => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      
      // If no profile exists, create one
      if (!existingProfile && !checkError) {
        const { error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: "",
            bio: "",
            updated_at: new Date().toISOString()
          });
          
        if (createError) {
          console.error("Error creating profile:", createError);
        } else {
          console.log("Created default profile for user:", userId);
        }
      }
    } catch (error) {
      console.error("Error in ensureProfileExists:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If successful and we have a user, ensure their profile exists
      if (data?.user && !error) {
        await ensureProfileExists(data.user.id);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Instead of redirecting to localhost, use the current domain
          emailRedirectTo: window.location.origin + '/auth',
        },
      });
      
      // If signup is successful without email confirmation required
      // (which would be unusual, but possible if email confirmation is disabled)
      if (data?.user && !error && data?.session) {
        await ensureProfileExists(data.user.id);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

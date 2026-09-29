import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if demo user saved
    const savedDemo = localStorage.getItem('interrogate_demo_user');
    const savedToken = localStorage.getItem('interrogate_auth_token');

    if (savedDemo && (!isSupabaseConfigured || savedToken === 'demo-token')) {
      const parsedUser = JSON.parse(savedDemo);
      setUser(parsedUser);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('interrogate_auth_token', session.access_token);
        }
        setLoading(false);
      }).catch(err => {
        console.warn("Supabase auth session fetch error:", err);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('interrogate_auth_token', session.access_token);
        } else if (!isDemo) {
          localStorage.removeItem('interrogate_auth_token');
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Default to guest user if no Supabase configured
      const defaultGuest = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'operative@interrogate.ai',
        user_metadata: { full_name: 'Agent Alex Mercer' }
      };
      setUser(defaultGuest);
      setIsDemo(true);
      localStorage.setItem('interrogate_demo_user', JSON.stringify(defaultGuest));
      localStorage.setItem('interrogate_auth_token', 'demo-token');
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        localStorage.setItem('interrogate_auth_token', data.session.access_token);
      }
      return data;
    } else {
      // Demo login
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: email.split('@')[0] }
      };
      setUser(demoUser);
      setIsDemo(true);
      localStorage.setItem('interrogate_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('interrogate_auth_token', 'demo-token');
      return { user: demoUser };
    }
  };

  const registerWithEmail = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      if (data.session) {
        localStorage.setItem('interrogate_auth_token', data.session.access_token);
      }
      return data;
    } else {
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: fullName || email.split('@')[0] }
      };
      setUser(demoUser);
      setIsDemo(true);
      localStorage.setItem('interrogate_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('interrogate_auth_token', 'demo-token');
      return { user: demoUser };
    }
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'tactical.agent@interrogate.ai',
      user_metadata: { full_name: 'Agent Alex Mercer' }
    };
    setUser(demoUser);
    setIsDemo(true);
    localStorage.setItem('interrogate_demo_user', JSON.stringify(demoUser));
    localStorage.setItem('interrogate_auth_token', 'demo-token');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(e => console.warn(e));
    }
    localStorage.removeItem('interrogate_auth_token');
    localStorage.removeItem('interrogate_demo_user');
    setUser(null);
    setSession(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isDemo,
      isSupabaseConfigured,
      loginWithEmail,
      registerWithEmail,
      loginAsDemo,
      logout
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

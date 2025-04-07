
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthLayout: checking authentication');
    
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in AuthLayout:', event, session ? 'session exists' : 'no session');
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        setIsAuthenticated(false);
        navigate('/login');
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or updated, setting authenticated = true');
        setIsAuthenticated(true);
      }
    });

    // Then check for existing session
    const checkAuth = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        const isAuth = !!session;
        
        setIsAuthenticated(isAuth);
        console.log('Auth check completed:', isAuth ? 'Authenticated' : 'Not authenticated');
        
        if (!isAuth && !location.pathname.includes('/auth/callback') && !location.search.includes('code=')) {
          // If not authenticated and not in the middle of auth flow, redirect to login
          console.log('User not authenticated, will redirect to login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast.error('Error checking authentication status');
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    return () => {
      console.log('AuthLayout: unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, location.search]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AuthLayout: redirecting to login because not authenticated');
    return <Navigate to="/login" replace />;
  }

  console.log('AuthLayout: user is authenticated, rendering outlet');
  return <Outlet />;
};

export default AuthLayout;

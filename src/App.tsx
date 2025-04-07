
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import AuthLayout from "./components/AuthLayout";
import { useEffect, useState } from "react";
import { supabase, testSupabaseConnection } from "./integrations/supabase/client";
import { toast } from "sonner";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper component to handle URL hash parameters that might contain authentication info
const AuthHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Log current location for debugging OAuth
    if (location.pathname.includes('/auth/callback') || location.search.includes('code=')) {
      console.log('Auth callback detected - Current URL:', window.location.href);
    }
    
    // Check if there are any hash parameters, URL parameters, or code - could be from OAuth callbacks
    if (location.hash || location.search) {
      const hasAuthCode = location.search.includes('code=');
      
      if (hasAuthCode) {
        console.log("Auth code detected in URL:", location.search);
        // Log the full URL for debugging
        console.log("Full current URL:", window.location.href);
        
        toast.info("Processing authentication...");
      }
      
      // If there's an error in the hash, extract and show it
      if (location.hash.includes("error=") || location.hash.includes("error_description=") || 
          location.search.includes("error=") || location.search.includes("error_description=")) {
        try {
          const params = new URLSearchParams(
            location.hash ? location.hash.substring(1) : location.search
          );
          const error = params.get("error");
          const errorDescription = params.get("error_description");
          
          if (error || errorDescription) {
            console.error("Auth error from URL:", error, errorDescription);
            toast.error(`Authentication error: ${errorDescription || error}`);
          }
        } catch (e) {
          console.error("Failed to parse auth error:", e);
        }
      }
    }
  }, [location]);

  return null;
};

const App = () => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  useEffect(() => {
    // Log authentication state and check Supabase configuration on app load
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase auth error:", error);
          return;
        }
        
        console.log("Current auth state:", data.session ? "Authenticated" : "Not authenticated");
        // Log the current URL for debugging
        console.log("Current URL:", window.location.href);
        
        // Test Supabase connection with our helper function - ONLY ONCE on initial load
        if (dbStatus === 'checking') {
          const connectionTest = await testSupabaseConnection();
          
          if (!connectionTest.success) {
            console.error("Supabase connection test failed:", connectionTest.error);
            setDbStatus('error');
            
            if (connectionTest.error?.includes("relation") && connectionTest.error?.includes("does not exist")) {
              console.error("Database tables not found. Please run migrations.");
            }
          } else {
            console.log("Supabase connection test: successful");
            setDbStatus('connected');
          }
        }
      } catch (error) {
        console.error("Supabase initialization error:", error);
        setDbStatus('error');
      }
    };
    
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "session exists" : "no session");
      
      if (event === 'SIGNED_IN') {
        toast.success("Successfully signed in!");
      } else if (event === 'SIGNED_OUT') {
        toast.info("You have been signed out");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dbStatus]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthHandler />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Index />} />
              </Route>
              
              {/* Auth redirect handler for email verification and oauth callbacks */}
              <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
              <Route path="/auth/v1/callback" element={<Navigate to="/dashboard" />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

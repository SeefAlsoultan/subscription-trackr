
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
    // Check if there are any hash parameters - could be from OAuth callbacks
    if (location.hash) {
      console.log("Auth hash detected:", location.hash);
      
      // The Supabase client should automatically handle this, but we'll log it for debugging
      toast.info("Processing authentication...");
      
      // If there's an error in the hash, extract and show it
      if (location.hash.includes("error=") || location.hash.includes("error_description=")) {
        try {
          const params = new URLSearchParams(location.hash.substring(1));
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
          toast.error("Authentication service error");
          return;
        }
        
        console.log("Current auth state:", data.session ? "Authenticated" : "Not authenticated");
        console.log("Current URL:", window.location.href);
        
        // Test Supabase connection with our helper function
        const connectionTest = await testSupabaseConnection();
        
        if (!connectionTest.success) {
          console.error("Supabase connection test failed:", connectionTest.error);
          setDbStatus('error');
          
          if (connectionTest.error?.includes("relation") && connectionTest.error?.includes("does not exist")) {
            toast.error("Database tables not found. Please run migrations.");
          } else {
            toast.error("Database connection error");
          }
        } else {
          console.log("Supabase connection test: successful");
          setDbStatus('connected');
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
  }, []);

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
              
              {/* Auth redirect handler for email verification */}
              <Route path="/auth/callback" element={<Navigate to="/dashboard" />} />
              
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

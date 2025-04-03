
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import AuthLayout from "./components/AuthLayout";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
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

const App = () => {
  useEffect(() => {
    // Log authentication state and Supabase configuration on app load
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Supabase auth error:", error);
          toast.error("Authentication service error");
          return;
        }
        
        console.log("Current auth state:", data.session ? "Authenticated" : "Not authenticated");
        
        // Test Supabase connection by making a simple query
        const { error: testError } = await supabase.from('subscriptions').select('count()', { count: 'exact', head: true });
        
        if (testError) {
          console.error("Supabase connection test failed:", testError);
          if (testError.message.includes("relation") && testError.message.includes("does not exist")) {
            toast.error("Database tables not found. Please run migrations.");
          } else {
            toast.error("Database connection error");
          }
        } else {
          console.log("Supabase connection test: successful");
        }
      } catch (error) {
        console.error("Supabase initialization error:", error);
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
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Index />} />
              </Route>
              
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

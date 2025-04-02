
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
import { supabase } from "./lib/supabase";
import { toast } from "sonner";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Check if Supabase credentials are available
const hasSupabaseCredentials = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const App = () => {
  useEffect(() => {
    // Log authentication state on app load for debugging
    if (hasSupabaseCredentials) {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();
        console.log("Current auth state:", data);
      };
      checkAuth();
    } else {
      // Display a toast notification if Supabase credentials are missing
      toast.warning(
        "Running without Supabase connection. Please provide Supabase credentials for full functionality.",
        {
          duration: 6000,
          id: "supabase-missing"
        }
      );
    }
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

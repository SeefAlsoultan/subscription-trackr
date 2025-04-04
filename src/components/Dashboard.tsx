
import { useState } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { SubscriptionFormData } from "@/types/subscription";
import PageTransition from "./PageTransition";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DevelopmentModeWarning } from "./dashboard/DevelopmentModeWarning";
import { OverviewTabContent } from "./dashboard/OverviewTabContent";
import { AnalyticsTabContent } from "./dashboard/AnalyticsTabContent";
import { CalendarTabContent } from "./dashboard/CalendarTabContent";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Dashboard() {
  const { subscriptions, loading } = useSubscriptions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const initialFormData: SubscriptionFormData = {
    name: "",
    description: "",
    cost: 0,
    billingCycle: "monthly",
    startDate: new Date(),
    nextBillingDate: new Date(),
    category: "entertainment",
    url: "",
    logo: "",
    color: "#10b981",
    status: "active",
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center">
          <DashboardHeader onAddSubscription={handleOpenDialog} />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {isUsingLocalStorage && <DevelopmentModeWarning />}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <OverviewTabContent 
              loading={loading}
              subscriptions={subscriptions}
              view={view}
              onViewChange={setView}
              onAddSubscription={handleOpenDialog}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTabContent 
              loading={loading}
              subscriptions={subscriptions}
              onAddSubscription={handleOpenDialog}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <CalendarTabContent 
              loading={loading}
              subscriptions={subscriptions}
              onAddSubscription={handleOpenDialog}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <ThemeToggle />
      
      <SubscriptionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={initialFormData}
      />
    </PageTransition>
  );
}

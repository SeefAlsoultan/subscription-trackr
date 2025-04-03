
import { useState } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { SubscriptionFormData } from "@/types/subscription";
import PageTransition from "./PageTransition";
import SupabaseConnectionTest from "./SupabaseConnectionTest";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DevelopmentModeWarning } from "./dashboard/DevelopmentModeWarning";
import { OverviewTabContent } from "./dashboard/OverviewTabContent";
import { AnalyticsTabContent } from "./dashboard/AnalyticsTabContent";
import { CalendarTabContent } from "./dashboard/CalendarTabContent";

export function Dashboard() {
  const { subscriptions, loading } = useSubscriptions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Check if we're in development mode and using local storage
  const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
    notes: "",
  };

  return (
    <PageTransition>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DashboardHeader onAddSubscription={handleOpenDialog} />

        {isUsingLocalStorage && <DevelopmentModeWarning />}

        <SupabaseConnectionTest />

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
      
      <SubscriptionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        initialData={initialFormData}
      />
    </PageTransition>
  );
}

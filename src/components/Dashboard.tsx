import { useEffect, useState } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionStats } from "./SubscriptionStats";
import { SubscriptionChart } from "./SubscriptionChart";
import { SubscriptionCalendar } from "./SubscriptionCalendar";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./ui/skeleton";
import { SubscriptionFormData } from "@/types/subscription";
import PageTransition from "./PageTransition";
import SupabaseConnectionTest from "./SupabaseConnectionTest";

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
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        </div>

        {isUsingLocalStorage && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Development Mode</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Running in local storage mode without Supabase. To enable full functionality, add Supabase credentials to your environment variables.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <SupabaseConnectionTest />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <SubscriptionStats />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Subscription Breakdown</CardTitle>
                  <CardDescription>
                    Your monthly spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SubscriptionChart />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Renewals</CardTitle>
                  <CardDescription>
                    Subscriptions renewing in the next 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No upcoming renewals. Add a subscription to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions
                        .filter(sub => {
                          const today = new Date();
                          const thirtyDaysFromNow = new Date();
                          thirtyDaysFromNow.setDate(today.getDate() + 30);
                          return (
                            sub.nextBillingDate >= today &&
                            sub.nextBillingDate <= thirtyDaysFromNow &&
                            sub.status === "active"
                          );
                        })
                        .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime())
                        .slice(0, 5)
                        .map(subscription => (
                          <div
                            key={subscription.id}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className="h-8 w-8 rounded-full"
                                style={{ backgroundColor: subscription.color }}
                              />
                              <div>
                                <p className="font-medium">{subscription.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {subscription.nextBillingDate.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              ${subscription.cost.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      {subscriptions.filter(sub => {
                        const today = new Date();
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setDate(today.getDate() + 30);
                        return (
                          sub.nextBillingDate >= today &&
                          sub.nextBillingDate <= thirtyDaysFromNow &&
                          sub.status === "active"
                        );
                      }).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No upcoming renewals in the next 30 days.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Your Subscriptions</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={view === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("grid")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Grid
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("list")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    List
                  </Button>
                </div>
              </div>
              
              {loading ? (
                view === "grid" ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-32">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <CardContent className="p-4">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="p-4 space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              ) : subscriptions.length === 0 ? (
                <EmptyState onAddSubscription={handleOpenDialog} />
              ) : view === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subscriptions.map(subscription => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                    />
                  ))}
                </div>
              ) : (
                <SubscriptionList subscriptions={subscriptions} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending Analytics</CardTitle>
                <CardDescription>
                  Track and analyze your subscription spending over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : subscriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[350px] space-y-3">
                    <p className="text-muted-foreground">No subscription data available</p>
                    <Button onClick={handleOpenDialog}>Add Subscription</Button>
                  </div>
                ) : (
                  <div className="h-[350px]">
                    <SubscriptionChart />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Calendar</CardTitle>
                <CardDescription>
                  View your upcoming subscription renewals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[500px] w-full" />
                ) : subscriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[500px] space-y-3">
                    <p className="text-muted-foreground">No subscription data available</p>
                    <Button onClick={handleOpenDialog}>Add Subscription</Button>
                  </div>
                ) : (
                  <div className="h-[500px]">
                    <SubscriptionCalendar subscriptions={subscriptions} />
                  </div>
                )}
              </CardContent>
            </Card>
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

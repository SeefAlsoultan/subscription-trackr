
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "./SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SubscriptionForm } from "./SubscriptionForm";
import { useState } from "react";
import { Plus, DollarSign, Calendar, BarChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getTotalMonthlyCost, getTotalYearlyCost } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingRenewals } from "./UpcomingRenewals";

export function Dashboard() {
  const { subscriptions } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalMonthly = getTotalMonthlyCost(activeSubscriptions);
  const totalYearly = getTotalYearlyCost(activeSubscriptions);
  
  // Group subscriptions by status
  const activeCount = subscriptions.filter(sub => sub.status === 'active').length;
  const pendingCount = subscriptions.filter(sub => sub.status === 'pending').length;
  const cancelledCount = subscriptions.filter(sub => sub.status === 'cancelled').length;
  const expiredCount = subscriptions.filter(sub => sub.status === 'expired').length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Subscription Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all your subscriptions in one place
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Subscription</span>
            </Button>
          </DialogTrigger>
          <SubscriptionForm 
            onClose={() => setShowAddDialog(false)} 
            mode="add" 
          />
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">
              For {activeCount} active subscriptions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Yearly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalYearly)}</div>
            <p className="text-xs text-muted-foreground">
              Annual projection based on current subscriptions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length} Total</div>
            <div className="text-xs text-muted-foreground flex gap-2">
              <span className="bg-green-500 px-1.5 py-0.5 rounded-full text-white">{activeCount} active</span>
              <span className="bg-yellow-500 px-1.5 py-0.5 rounded-full text-white">{pendingCount} pending</span>
              <span className="bg-red-500 px-1.5 py-0.5 rounded-full text-white">{cancelledCount} cancelled</span>
              <span className="bg-gray-500 px-1.5 py-0.5 rounded-full text-white">{expiredCount} expired</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledCount})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard 
                key={subscription.id} 
                subscription={subscription} 
              />
            ))}
            {subscriptions.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No subscriptions found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  Add your first subscription
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscriptions
              .filter(sub => sub.status === 'active')
              .map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                />
              ))}
            {activeCount === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No active subscriptions found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  Add a subscription
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscriptions
              .filter(sub => sub.status === 'pending')
              .map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                />
              ))}
            {pendingCount === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No pending subscriptions found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscriptions
              .filter(sub => sub.status === 'cancelled')
              .map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                />
              ))}
            {cancelledCount === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No cancelled subscriptions found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="expired" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subscriptions
              .filter(sub => sub.status === 'expired')
              .map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                />
              ))}
            {expiredCount === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No expired subscriptions found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Renewals</h2>
        <UpcomingRenewals />
      </div>
    </div>
  );
}

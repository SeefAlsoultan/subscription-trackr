
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "./SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriptionForm } from "./SubscriptionForm";
import { useState } from "react";
import { Plus, DollarSign, Calendar, BarChart, ArrowDownUp, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getTotalMonthlyCost, getTotalYearlyCost } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingRenewals } from "./UpcomingRenewals";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { SubscriptionServiceSelect } from "./SubscriptionServiceSelect";
import { connectToSubscriptionService } from "@/lib/serviceConnection";
import { toast } from "sonner";

export function Dashboard() {
  const { subscriptions, loading, addSubscription } = useSubscriptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showServiceSelect, setShowServiceSelect] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/landing');
  };
  
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
  };
  
  const handleConnectService = async (service: any) => {
    toast.loading(`Connecting to ${service.name}...`);
    
    const subscriptionInfo = await connectToSubscriptionService(service.id);
    
    if (subscriptionInfo) {
      // Pre-fill the subscription form with data from the service
      setShowServiceSelect(false);
      setShowAddDialog(true);
      
      // In a real app, we would pass the subscription info to the form
      // For now, the form will handle this with mock data
    } else if (service.id === 'other') {
      // For "Other", just show the regular form
      setShowServiceSelect(false);
      setShowAddDialog(true);
    }
  };
  
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalMonthly = getTotalMonthlyCost(activeSubscriptions);
  const totalYearly = getTotalYearlyCost(activeSubscriptions);
  
  // Group subscriptions by status
  const activeCount = subscriptions.filter(sub => sub.status === 'active').length;
  const pendingCount = subscriptions.filter(sub => sub.status === 'pending').length;
  const cancelledCount = subscriptions.filter(sub => sub.status === 'cancelled').length;
  const expiredCount = subscriptions.filter(sub => sub.status === 'expired').length;
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }
  
  if (subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome to SubscriptionTrackr!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start managing your subscriptions by adding your first one
          </p>
          
          <div className="mb-12">
            <Dialog 
              open={showServiceSelect} 
              onOpenChange={(open) => {
                setShowServiceSelect(open);
                if (!open) setSelectedService(null);
              }}
            >
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg animate-pulse"
                  onClick={() => setShowServiceSelect(true)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Your First Subscription</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <SubscriptionServiceSelect 
                  onSelect={handleServiceSelect}
                  onConnectService={handleConnectService}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog 
              open={showAddDialog} 
              onOpenChange={(open) => {
                setShowAddDialog(open);
                if (!open && selectedService) {
                  setSelectedService(null);
                }
              }}
            >
              <SubscriptionForm 
                onClose={() => setShowAddDialog(false)} 
                mode="add" 
                preselectedService={selectedService?.id}
              />
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Track Spending</h3>
                <p className="text-muted-foreground">Never lose track of how much you're spending on subscriptions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Renewal Alerts</h3>
                <p className="text-muted-foreground">Get notified before you're charged for any subscription</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700">
              <CardContent className="p-6 text-center">
                <ArrowDownUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Manage Everything</h3>
                <p className="text-muted-foreground">Edit, update or cancel all your subscriptions in one place</p>
              </CardContent>
            </Card>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Subscription Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track all your subscriptions in one place
          </p>
        </div>
        
        <div className="flex gap-2">
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
          
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
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


import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BillingCycle, Subscription } from "@/types/subscription";
import { BadgeDollarSign, CalendarClock, CreditCard, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function SubscriptionStats() {
  const { subscriptions, loading } = useSubscriptions();
  
  // Only include active subscriptions in statistics
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  // Calculate total spending
  const totalMonthlySpending = calculateTotalMonthlySpending(activeSubscriptions);
  const totalYearlySpending = totalMonthlySpending * 12;
  
  // Calculate most expensive subscription
  const mostExpensiveSubscription = findMostExpensiveSubscription(activeSubscriptions);
  
  // Calculate upcoming renewals (in the next 7 days)
  const upcomingRenewals = countUpcomingRenewals(activeSubscriptions);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Spending
          </CardTitle>
          <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? 
              <div className="h-8 w-24 rounded bg-muted animate-pulse" /> : 
              formatCurrency(totalMonthlySpending)
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {loading ? "" : `${formatCurrency(totalYearlySpending)} per year`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? 
              <div className="h-8 w-16 rounded bg-muted animate-pulse" /> : 
              activeSubscriptions.length
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {loading ? "" : `${subscriptions.length} total subscriptions`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Expensive
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading || !mostExpensiveSubscription ? 
              <div className="h-8 w-20 rounded bg-muted animate-pulse" /> : 
              formatCurrency(mostExpensiveSubscription.cost)
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {loading || !mostExpensiveSubscription ? "" : 
              mostExpensiveSubscription.name + 
              (mostExpensiveSubscription.billingCycle !== 'monthly' ? 
                ` (${mostExpensiveSubscription.billingCycle})` : '')
            }
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Renewals
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? 
              <div className="h-8 w-16 rounded bg-muted animate-pulse" /> : 
              upcomingRenewals
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {loading ? "" : "In the next 7 days"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function calculateTotalMonthlySpending(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, subscription) => {
    let monthlyCost = subscription.cost;
    
    // Convert subscription cost to monthly equivalent
    switch (subscription.billingCycle) {
      case 'weekly':
        monthlyCost = subscription.cost * 4.33; // Average weeks in a month
        break;
      case 'quarterly':
        monthlyCost = subscription.cost / 3;
        break;
      case 'yearly':
        monthlyCost = subscription.cost / 12;
        break;
    }
    
    return total + monthlyCost;
  }, 0);
}

function findMostExpensiveSubscription(subscriptions: Subscription[]): Subscription | null {
  if (subscriptions.length === 0) return null;
  
  // Normalize costs to monthly
  const withMonthlyCost = subscriptions.map(sub => {
    let monthlyCost = sub.cost;
    
    switch (sub.billingCycle) {
      case 'weekly':
        monthlyCost = sub.cost * 4.33;
        break;
      case 'quarterly':
        monthlyCost = sub.cost / 3;
        break;
      case 'yearly':
        monthlyCost = sub.cost / 12;
        break;
    }
    
    return {
      ...sub,
      monthlyCost
    };
  });
  
  // Find subscription with highest monthly cost
  return withMonthlyCost.reduce((max, current) => 
    !max || current.monthlyCost > max.monthlyCost ? current : max, 
    null as (typeof withMonthlyCost[0] | null)
  );
}

function countUpcomingRenewals(subscriptions: Subscription[]): number {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  return subscriptions.filter(sub => {
    const renewalDate = sub.nextBillingDate;
    return renewalDate >= today && renewalDate <= nextWeek;
  }).length;
}

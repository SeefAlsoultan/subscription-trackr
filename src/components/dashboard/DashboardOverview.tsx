
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionChart } from "../SubscriptionChart";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Subscription } from "@/types/subscription";

interface DashboardOverviewProps {
  loading: boolean;
  subscriptions: Subscription[];
  onAddSubscription: () => void;
}

export function DashboardOverview({ loading, subscriptions, onAddSubscription }: DashboardOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Subscription Breakdown</CardTitle>
          <CardDescription>Your monthly spending by category</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <SubscriptionChart />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Renewals</CardTitle>
          <CardDescription>Subscriptions renewing in the next 30 days</CardDescription>
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
  );
}


import { Subscription } from "@/types/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { SubscriptionChart } from "../SubscriptionChart";

interface AnalyticsTabContentProps {
  loading: boolean;
  subscriptions: Subscription[];
  onAddSubscription: () => void;
}

export function AnalyticsTabContent({ 
  loading, 
  subscriptions, 
  onAddSubscription 
}: AnalyticsTabContentProps) {
  return (
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
            <Button onClick={onAddSubscription}>Add Subscription</Button>
          </div>
        ) : (
          <div className="h-[350px]">
            <SubscriptionChart />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

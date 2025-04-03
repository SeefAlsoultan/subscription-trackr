
import { Subscription } from "@/types/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { SubscriptionCalendar } from "../../components/SubscriptionCalendar";

interface CalendarTabContentProps {
  loading: boolean;
  subscriptions: Subscription[];
  onAddSubscription: () => void;
}

export function CalendarTabContent({ 
  loading, 
  subscriptions, 
  onAddSubscription 
}: CalendarTabContentProps) {
  return (
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
            <Button onClick={onAddSubscription}>Add Subscription</Button>
          </div>
        ) : (
          <div className="h-[500px]">
            <SubscriptionCalendar subscriptions={subscriptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

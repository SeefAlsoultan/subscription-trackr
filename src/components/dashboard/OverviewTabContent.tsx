
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { SubscriptionStats } from "../SubscriptionStats";
import { DashboardOverview } from "./DashboardOverview";
import { SubscriptionViewToggle } from "./SubscriptionViewToggle";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../EmptyState";
import { SubscriptionCard } from "../SubscriptionCard";
import { SubscriptionList } from "../SubscriptionList";

interface OverviewTabContentProps {
  loading: boolean;
  subscriptions: Subscription[];
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onAddSubscription: () => void;
}

export function OverviewTabContent({
  loading,
  subscriptions,
  view,
  onViewChange,
  onAddSubscription
}: OverviewTabContentProps) {
  return (
    <div className="space-y-4">
      <SubscriptionStats />
      
      <DashboardOverview 
        loading={loading}
        subscriptions={subscriptions}
        onAddSubscription={onAddSubscription}
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Subscriptions</h3>
          <SubscriptionViewToggle view={view} onViewChange={onViewChange} />
        </div>
        
        {loading ? (
          view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32">
                    <Skeleton className="h-full w-full" />
                  </div>
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
                  </div>
                ))}
              </div>
            </Card>
          )
        ) : subscriptions.length === 0 ? (
          <EmptyState onAddSubscription={onAddSubscription} />
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
    </div>
  );
}

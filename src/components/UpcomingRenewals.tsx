
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInDays } from "date-fns";

export function UpcomingRenewals() {
  const { subscriptions } = useSubscriptions();
  
  // Filter to only active subscriptions
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  );
  
  // Sort by closest renewal date
  const sortedSubscriptions = [...activeSubscriptions].sort((a, b) => {
    return a.nextBillingDate.getTime() - b.nextBillingDate.getTime();
  });
  
  // Filter to only show subscriptions that will renew in the next 30 days
  const upcomingRenewals = sortedSubscriptions.filter((sub) => {
    const daysUntilRenewal = differenceInDays(sub.nextBillingDate, new Date());
    return daysUntilRenewal >= 0 && daysUntilRenewal <= 30;
  });
  
  if (upcomingRenewals.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No upcoming renewals in the next 30 days.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Renewal Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {upcomingRenewals.map((subscription) => {
                const daysLeft = differenceInDays(
                  subscription.nextBillingDate,
                  new Date()
                );
                
                return (
                  <tr key={subscription.id} className="border-b">
                    <td className="px-4 py-3 text-sm">{subscription.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(subscription.nextBillingDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(subscription.cost)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          daysLeft <= 3
                            ? "bg-red-500 text-white"
                            : daysLeft <= 7
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {daysLeft} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

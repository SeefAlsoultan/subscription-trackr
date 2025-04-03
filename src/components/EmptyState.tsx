
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onAddSubscription: () => void;
}

export function EmptyState({ onAddSubscription }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 py-16 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <PlusCircle className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start tracking your subscriptions to visualize spending patterns and manage renewals in one place.
        </p>
        <Button onClick={onAddSubscription}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First Subscription
        </Button>
      </CardContent>
    </Card>
  );
}

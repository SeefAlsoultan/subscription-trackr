
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  onAddSubscription: () => void;
}

export function DashboardHeader({ onAddSubscription }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Subscriptions Dashboard</h2>
      <div className="flex items-center space-x-2">
        <Button onClick={onAddSubscription}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>
    </div>
  );
}


import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/subscription";
import { useSubscriptions } from "@/contexts/SubscriptionContext";

interface DeleteSubscriptionDialogProps {
  subscription: Subscription;
  onClose: () => void;
}

export function DeleteSubscriptionDialog({ subscription, onClose }: DeleteSubscriptionDialogProps) {
  const { deleteSubscription } = useSubscriptions();
  
  const handleDelete = () => {
    deleteSubscription(subscription.id);
    onClose();
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Subscription</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the '{subscription.name}' subscription? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

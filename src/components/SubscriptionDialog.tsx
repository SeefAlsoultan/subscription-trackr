
import React from "react";
import { SubscriptionFormData } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "./SubscriptionForm";
import { useSubscriptions } from "@/contexts/SubscriptionContext";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: SubscriptionFormData;
  subscriptionId?: string;
}

export const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  subscriptionId,
}) => {
  const { addSubscription, updateSubscription } = useSubscriptions();

  const handleSubmit = async (data: SubscriptionFormData) => {
    try {
      if (subscriptionId) {
        await updateSubscription({ ...data, id: subscriptionId });
      } else {
        await addSubscription(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subscriptionId ? "Edit Subscription" : "Add New Subscription"}
          </DialogTitle>
          <DialogDescription>
            {subscriptionId
              ? "Update your subscription details below."
              : "Fill in the details to add a new subscription."}
          </DialogDescription>
        </DialogHeader>

        <SubscriptionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

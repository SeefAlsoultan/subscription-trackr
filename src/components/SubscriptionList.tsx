
import { Subscription } from "@/types/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { formatDate, formatCurrency, getBillingInfo, getDaysUntilRenewal, getStatusColor, isOverdue } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { SubscriptionForm } from "./SubscriptionForm";
import { DeleteSubscriptionDialog } from "./DeleteSubscriptionDialog";

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {subscriptions.map((subscription) => (
            <SubscriptionListItem 
              key={subscription.id} 
              subscription={subscription} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SubscriptionListItemProps {
  subscription: Subscription;
}

function SubscriptionListItem({ subscription }: SubscriptionListItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    id,
    name, 
    description, 
    logo, 
    cost, 
    billingCycle, 
    nextBillingDate, 
    category,
    status,
    url
  } = subscription;
  
  const daysUntilRenewal = getDaysUntilRenewal(nextBillingDate);
  const overdue = isOverdue(nextBillingDate);

  return (
    <div className="flex items-start justify-between p-4 hover:bg-muted/50">
      <div className="flex items-start gap-3">
        <div 
          className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
          style={{ backgroundColor: subscription.color || '#10b981' }}
        >
          {name.charAt(0)}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{name}</h4>
            <Badge className={`${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Price:</span>{" "}
              <span className="font-medium">{getBillingInfo(subscription)}</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">Category:</span>{" "}
              <span className="font-medium capitalize">{category}</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">Next billing:</span>{" "}
              <span className={`font-medium ${overdue ? 'text-destructive' : ''}`}>
                {formatDate(nextBillingDate)}
              </span>
            </div>
            
            {status === 'active' && (
              <div className="text-sm">
                <span className="text-muted-foreground">Renews in:</span>{" "}
                <Badge variant={overdue ? "destructive" : daysUntilRenewal <= 3 ? "default" : "secondary"}>
                  {overdue ? 'Overdue' : `${daysUntilRenewal} days`}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {url && (
          <Button variant="ghost" size="icon" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <SubscriptionForm 
            subscriptionId={id}
            onClose={() => setShowEditDialog(false)} 
            mode="edit" 
          />
        </Dialog>
        
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DeleteSubscriptionDialog 
            subscription={subscription} 
            onClose={() => setShowDeleteDialog(false)} 
          />
        </Dialog>
      </div>
    </div>
  );
}

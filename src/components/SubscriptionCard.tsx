
import { Subscription } from "@/types/subscription";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { formatDate, formatCurrency, getBillingInfo, getDaysUntilRenewal, getStatusColor, isOverdue } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { SubscriptionForm } from "./SubscriptionForm";
import { DeleteSubscriptionDialog } from "./DeleteSubscriptionDialog";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { 
    name, 
    description, 
    logo, 
    cost, 
    billingCycle, 
    nextBillingDate, 
    status 
  } = subscription;
  
  const daysUntilRenewal = getDaysUntilRenewal(nextBillingDate);
  const overdue = isOverdue(nextBillingDate);
  
  return (
    <>
      <Card className={`subscription-card hover:border-${subscription.color || 'subscription-default'}/50`}>
        {logo && (
          <div className={`subscription-logo bg-${subscription.color || 'subscription-default'}`}>
            <span className="text-white font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        <CardHeader className="pt-2 px-3 pb-0 flex flex-row justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <Badge className={`${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardHeader>
        
        <CardContent className="px-3 py-2">
          <div className="grid gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price:</span>
              <span className="font-medium">{getBillingInfo(subscription)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next billing:</span>
              <span className={`font-medium ${overdue ? 'text-destructive' : ''}`}>
                {formatDate(nextBillingDate)}
              </span>
            </div>
            
            {status === 'active' && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Renews in:</span>
                <Badge variant={overdue ? "destructive" : daysUntilRenewal <= 3 ? "default" : "secondary"}>
                  {overdue ? 'Overdue' : `${daysUntilRenewal} days`}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="px-3 pt-0 pb-2 flex justify-between gap-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </DialogTrigger>
            <SubscriptionForm 
              subscription={subscription} 
              onClose={() => setShowEditDialog(false)} 
              mode="edit" 
            />
          </Dialog>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </DialogTrigger>
            <DeleteSubscriptionDialog 
              subscription={subscription} 
              onClose={() => setShowDeleteDialog(false)} 
            />
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}


import { useState } from "react";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, getBillingCycleOptions, getStatusOptions, getCategoryOptions } from "@/lib/utils";
import { Subscription, SubscriptionFormData } from "@/types/subscription";
import { useSubscriptions } from "@/contexts/SubscriptionContext";

interface SubscriptionFormProps {
  subscription?: Subscription;
  onClose: () => void;
  mode: 'add' | 'edit';
}

export function SubscriptionForm({ subscription, onClose, mode }: SubscriptionFormProps) {
  const { addSubscription, updateSubscription } = useSubscriptions();
  
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: subscription?.name || '',
    description: subscription?.description || '',
    logo: subscription?.logo || '',
    color: subscription?.color || '',
    cost: subscription?.cost || 0,
    billingCycle: subscription?.billingCycle || 'monthly',
    nextBillingDate: subscription?.nextBillingDate || new Date(),
    status: subscription?.status || 'active',
    category: subscription?.category || 'Other',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'add') {
      addSubscription(formData);
    } else if (subscription) {
      updateSubscription(subscription.id, formData);
    }
    
    onClose();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        nextBillingDate: date,
      });
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{mode === 'add' ? 'Add Subscription' : 'Edit Subscription'}</DialogTitle>
        <DialogDescription>
          {mode === 'add' 
            ? 'Add a new subscription to track your expenses.' 
            : 'Make changes to your subscription here.'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) => handleSelectChange('billingCycle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                {getBillingCycleOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label>Next Billing Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.nextBillingDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.nextBillingDate ? (
                  format(formData.nextBillingDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.nextBillingDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category || 'Other'}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === 'add' ? 'Add Subscription' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}


export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';

export type Subscription = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  color?: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  nextBillingDate: Date;
  status: SubscriptionStatus;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SubscriptionFormData = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>;


export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';
export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type SubscriptionCategory = 'entertainment' | 'software' | 'music' | 'news' | 'gaming' | 'other';

export interface SubscriptionFormData {
  name: string;
  description?: string;
  url?: string;
  cost: number;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  startDate: Date;
  nextBillingDate: Date;
  status: SubscriptionStatus;
}

export interface Subscription extends SubscriptionFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  serviceId?: string;
}

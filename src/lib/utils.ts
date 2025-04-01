
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInDays, isBefore } from "date-fns";
import { Subscription } from "@/types/subscription";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function getBillingInfo(subscription: Subscription): string {
  const { cost, billingCycle } = subscription;
  
  return `${formatCurrency(cost)} / ${billingCycle.slice(0, -2)}`;
}

export function getDaysUntilRenewal(date: Date): number {
  return Math.max(0, differenceInDays(date, new Date()));
}

export function isOverdue(date: Date): boolean {
  return isBefore(date, new Date());
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500 text-green-50';
    case 'pending':
      return 'bg-yellow-500 text-yellow-50';
    case 'cancelled':
      return 'bg-red-500 text-red-50';
    case 'expired':
      return 'bg-gray-500 text-gray-50';
    default:
      return 'bg-blue-500 text-blue-50';
  }
}

export function getLogoComponent(logo: string): string {
  // In a real app, we'd return actual logo components or images
  return logo;
}

export function getCategoryCount(subscriptions: Subscription[]): Record<string, number> {
  return subscriptions.reduce((acc, subscription) => {
    const category = subscription.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getBillingCycleOptions() {
  return [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'weekly', label: 'Weekly' },
  ];
}

export function getStatusOptions() {
  return [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'expired', label: 'Expired' },
  ];
}

export function getCategoryOptions() {
  return [
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Music', label: 'Music' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Productivity', label: 'Productivity' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
  ];
}

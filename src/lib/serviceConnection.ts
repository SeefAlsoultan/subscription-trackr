
import { toast } from "sonner";
import { subscriptionServices } from "@/components/SubscriptionServiceSelect";

// Mock for subscription data we might fetch from a service API
export type ServiceSubscriptionInfo = {
  plan: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  nextBillingDate: Date;
  startDate: Date;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
};

// In a real app, this would integrate with OAuth flows for each service
export const connectToSubscriptionService = (
  serviceId: string
): Promise<ServiceSubscriptionInfo | null> => {
  // In a production app, this would redirect to OAuth flow
  // For this simulation, we'll open the service login in a new tab
  // and simulate a successful connection
  
  const service = subscriptionServices.find(s => s.id === serviceId);
  
  if (!service) {
    toast.error("Service not found");
    return Promise.resolve(null);
  }
  
  if (service.url) {
    // Open the service login page in a new tab
    window.open(service.url, '_blank');
  }
  
  // Simulate fetching subscription details from the service API
  // In a real app, this would happen after OAuth callback
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Return mock subscription data
      if (serviceId === 'other') {
        // For "Other", we'll return null and let the user enter details manually
        resolve(null);
      } else {
        const mockData: ServiceSubscriptionInfo = {
          plan: getDefaultPlan(serviceId),
          cost: getDefaultCost(serviceId),
          billingCycle: 'monthly',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          startDate: new Date(),
          status: 'active',
        };
        
        toast.success(`Connected to ${service.name}`);
        resolve(mockData);
      }
    }, 2000); // Simulate a 2-second API call
  });
};

// Get default plan name based on service
const getDefaultPlan = (serviceId: string): string => {
  const plans: Record<string, string> = {
    netflix: 'Standard with ads',
    spotify: 'Premium Individual',
    disney: 'Disney+ Basic',
    hulu: 'Hulu (With Ads)',
    amazon: 'Prime Monthly',
    youtube: 'Individual',
    appletv: 'Monthly Plan',
    hbomax: 'With Ads',
    other: 'Standard',
  };
  
  return plans[serviceId] || 'Standard';
};

// Get default cost based on service
const getDefaultCost = (serviceId: string): number => {
  const costs: Record<string, number> = {
    netflix: 6.99,
    spotify: 9.99,
    disney: 7.99,
    hulu: 7.99,
    amazon: 14.99,
    youtube: 11.99,
    appletv: 6.99,
    hbomax: 9.99,
    other: 9.99,
  };
  
  return costs[serviceId] || 9.99;
};

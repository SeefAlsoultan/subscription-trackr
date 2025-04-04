
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
  features?: string[];  // Added to show what features are supported for this subscription
  canEditDirectly?: boolean;  // Whether the subscription can be edited directly through the API
  canCancelDirectly?: boolean; // Whether the subscription can be cancelled directly through the API
  integrationStatus?: 'connected' | 'pending' | 'failed';
  availablePlans?: Array<{name: string, price: number, billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly'}>;
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
  
  // Show connecting toast to improve user experience
  toast.loading(`Connecting to ${service.name}...`);
  
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
        toast.dismiss();
        toast.info("Please enter subscription details manually");
        resolve(null);
      } else {
        const mockData: ServiceSubscriptionInfo = {
          plan: getDefaultPlan(serviceId),
          cost: getDefaultCost(serviceId),
          billingCycle: 'monthly',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          startDate: new Date(),
          status: 'active',
          features: getServiceFeatures(serviceId),
          canEditDirectly: canEditDirectly(serviceId),
          canCancelDirectly: canCancelDirectly(serviceId),
          integrationStatus: 'connected',
          availablePlans: getAvailablePlans(serviceId)
        };
        
        toast.dismiss();
        toast.success(`Connected to ${service.name}`);
        resolve(mockData);
      }
    }, 2000); // Simulate a 2-second API call
  });
};

// Get available plans for each service
const getAvailablePlans = (serviceId: string) => {
  const plans: Record<string, Array<{name: string, price: number, billingCycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly'}>> = {
    netflix: [
      {name: 'Standard with ads', price: 6.99, billingCycle: 'monthly'},
      {name: 'Standard', price: 15.49, billingCycle: 'monthly'},
      {name: 'Premium', price: 22.99, billingCycle: 'monthly'}
    ],
    spotify: [
      {name: 'Premium Individual', price: 9.99, billingCycle: 'monthly'},
      {name: 'Premium Duo', price: 14.99, billingCycle: 'monthly'},
      {name: 'Premium Family', price: 16.99, billingCycle: 'monthly'},
      {name: 'Premium Student', price: 4.99, billingCycle: 'monthly'}
    ],
    disney: [
      {name: 'Disney+ Basic', price: 7.99, billingCycle: 'monthly'},
      {name: 'Disney+ Premium', price: 13.99, billingCycle: 'monthly'},
      {name: 'Disney+ Annual', price: 139.99, billingCycle: 'yearly'}
    ],
    hulu: [
      {name: 'Hulu (With Ads)', price: 7.99, billingCycle: 'monthly'},
      {name: 'Hulu (No Ads)', price: 17.99, billingCycle: 'monthly'}
    ],
    youtube: [
      {name: 'Individual', price: 11.99, billingCycle: 'monthly'},
      {name: 'Family', price: 22.99, billingCycle: 'monthly'},
      {name: 'Student', price: 7.99, billingCycle: 'monthly'}
    ]
  };
  
  return plans[serviceId] || [];
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

// Get available features for service
const getServiceFeatures = (serviceId: string): string[] => {
  const features: Record<string, string[]> = {
    netflix: ['Change plan', 'View billing history', 'Update payment method', 'Cancel subscription'],
    spotify: ['Change plan', 'View billing history', 'Cancel subscription'],
    disney: ['Change plan', 'View billing history', 'Update payment method', 'Cancel subscription'],
    hulu: ['Change plan', 'View billing history', 'Cancel subscription'],
    amazon: ['View benefits', 'View billing history', 'Manage payment method'],
    youtube: ['Change plan', 'View billing history', 'Cancel subscription'],
    appletv: ['View billing history', 'Cancel subscription'],
    hbomax: ['Change plan', 'View billing history', 'Cancel subscription'],
  };
  
  return features[serviceId] || [];
};

// Check if service supports direct editing
const canEditDirectly = (serviceId: string): boolean => {
  const supportedServices = ['netflix', 'spotify', 'disney', 'hulu', 'youtube', 'hbomax'];
  return supportedServices.includes(serviceId);
};

// Check if service supports direct cancellation
const canCancelDirectly = (serviceId: string): boolean => {
  const supportedServices = ['netflix', 'spotify', 'disney', 'hulu', 'youtube', 'appletv', 'hbomax'];
  return supportedServices.includes(serviceId);
};

// Simulate changing a plan
export const changePlan = (serviceId: string, plan: string): Promise<{ success: boolean, message?: string }> => {
  return new Promise((resolve) => {
    // Show loading toast
    toast.loading(`Updating ${subscriptionServices.find(s => s.id === serviceId)?.name} plan...`);
    
    // Simulate API call
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Changed plan to ${plan}`);
      resolve({ 
        success: true,
        message: `Successfully updated to ${plan}`
      });
    }, 1500);
  });
};

// Simulate cancelling a subscription
export const cancelSubscription = (serviceId: string): Promise<{ success: boolean, message?: string }> => {
  return new Promise((resolve) => {
    // Show loading toast
    toast.loading(`Cancelling ${subscriptionServices.find(s => s.id === serviceId)?.name} subscription...`);
    
    // Simulate API call
    setTimeout(() => {
      toast.dismiss();
      toast.success('Subscription cancelled successfully');
      resolve({ 
        success: true,
        message: 'Your subscription has been cancelled. You will still have access until the end of your billing period.'
      });
    }, 1500);
  });
};

// Simulate connecting to a service that requires authentication
export const authenticateService = (serviceId: string): Promise<{ success: boolean, message?: string }> => {
  const service = subscriptionServices.find(s => s.id === serviceId);
  
  if (!service) {
    return Promise.resolve({ 
      success: false, 
      message: "Service not found" 
    });
  }
  
  return new Promise((resolve) => {
    // Show loading toast
    toast.loading(`Authenticating with ${service.name}...`);
    
    // In a real app, this would redirect to OAuth flow
    if (service.url) {
      window.open(service.url, '_blank');
    }
    
    // Simulate API delay
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Connected to ${service.name}`);
      resolve({ 
        success: true,
        message: `Successfully connected to ${service.name}`
      });
    }, 2000);
  });
};

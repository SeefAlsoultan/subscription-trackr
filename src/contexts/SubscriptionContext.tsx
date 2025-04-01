
import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from "react";
import { Subscription, SubscriptionFormData } from "../types/subscription";
import { mockSubscriptions, calculateNextBillingDate } from "../lib/data";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: SubscriptionFormData) => void;
  updateSubscription: (id: string, subscription: Partial<SubscriptionFormData>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch data from an API here
    setSubscriptions(mockSubscriptions);
    
    // Setup notifications for upcoming renewals
    const checkUpcomingRenewals = () => {
      const upcomingRenewals = subscriptions.filter(sub => {
        const daysUntilRenewal = Math.ceil((sub.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return sub.status === 'active' && daysUntilRenewal <= 3 && daysUntilRenewal > 0;
      });
      
      upcomingRenewals.forEach(sub => {
        const daysUntilRenewal = Math.ceil((sub.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        toast(`${sub.name} will renew in ${daysUntilRenewal} days`, {
          description: `You will be charged $${sub.cost.toFixed(2)}`,
        });
      });
    };
    
    checkUpcomingRenewals();
    const interval = setInterval(checkUpcomingRenewals, 86400000); // Check once a day
    
    return () => clearInterval(interval);
  }, []);
  
  const addSubscription = (subscription: SubscriptionFormData) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setSubscriptions([...subscriptions, newSubscription]);
    toast.success(`${subscription.name} subscription added!`);
  };
  
  const updateSubscription = (id: string, updatedData: Partial<SubscriptionFormData>) => {
    setSubscriptions(subscriptions.map(subscription => {
      if (subscription.id === id) {
        const updated = {
          ...subscription,
          ...updatedData,
          updatedAt: new Date(),
        };
        
        // Recalculate next billing date if billing cycle changes
        if (updatedData.billingCycle && (updatedData.billingCycle !== subscription.billingCycle)) {
          updated.nextBillingDate = calculateNextBillingDate(new Date(), updatedData.billingCycle);
        }
        
        return updated;
      }
      return subscription;
    }));
    
    toast.success("Subscription updated!");
  };
  
  const deleteSubscription = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
    
    if (subscription) {
      toast.success(`${subscription.name} subscription deleted!`);
    }
  };
  
  const getSubscriptionById = (id: string) => {
    return subscriptions.find(subscription => subscription.id === id);
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscriptionById,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

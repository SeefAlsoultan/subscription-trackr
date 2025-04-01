
import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from "react";
import { Subscription, SubscriptionFormData } from "../types/subscription";
import { toast } from "sonner";
import {
  getSubscriptions,
  addSubscriptionToDb,
  updateSubscriptionInDb,
  deleteSubscriptionFromDb,
  getCurrentUser
} from "@/lib/supabase";
import { calculateNextBillingDate } from "@/lib/data";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: SubscriptionFormData) => void;
  updateSubscription: (id: string, subscription: Partial<SubscriptionFormData>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const data = await getSubscriptions();
          setSubscriptions(data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
    
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
    
    // Check less frequently to avoid overwhelming the user with notifications
    if (subscriptions.length > 0) {
      checkUpcomingRenewals();
      const interval = setInterval(checkUpcomingRenewals, 86400000); // Check once a day
      return () => clearInterval(interval);
    }
  }, [subscriptions.length]);
  
  const addSubscription = async (subscription: SubscriptionFormData) => {
    try {
      const newSubscription = await addSubscriptionToDb(subscription);
      setSubscriptions([...subscriptions, newSubscription]);
      toast.success(`${subscription.name} subscription added!`);
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast.error("Failed to add subscription");
    }
  };
  
  const updateSubscription = async (id: string, updatedData: Partial<SubscriptionFormData>) => {
    try {
      const updated = await updateSubscriptionInDb(id, updatedData);
      
      setSubscriptions(subscriptions.map(subscription => {
        if (subscription.id === id) {
          const updatedSubscription = {
            ...subscription,
            ...updated
          };
          
          // Recalculate next billing date if billing cycle changes
          if (updatedData.billingCycle && (updatedData.billingCycle !== subscription.billingCycle)) {
            updatedSubscription.nextBillingDate = calculateNextBillingDate(new Date(), updatedData.billingCycle);
          }
          
          return updatedSubscription;
        }
        return subscription;
      }));
      
      toast.success("Subscription updated!");
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    }
  };
  
  const deleteSubscription = async (id: string) => {
    try {
      const subscription = subscriptions.find(sub => sub.id === id);
      await deleteSubscriptionFromDb(id);
      
      setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
      
      if (subscription) {
        toast.success(`${subscription.name} subscription deleted!`);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
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
        loading
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

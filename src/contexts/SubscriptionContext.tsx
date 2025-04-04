
import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from "react";
import { Subscription, SubscriptionFormData } from "../types/subscription";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          if (data) {
            const formattedData = data.map(item => ({
              ...item,
              id: item.id,
              nextBillingDate: new Date(item.nextBillingDate),
              startDate: new Date(item.startDate),
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            })) as Subscription[];
            
            setSubscriptions(formattedData);
          }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Convert Date objects to ISO strings for Supabase and use lowercase field names
      const supabaseSubscription = {
        user_id: user.id,
        name: subscription.name,
        description: subscription.description,
        url: subscription.url,
        logo: subscription.logo,
        color: subscription.color,
        cost: subscription.cost,
        billingcycle: subscription.billingCycle,
        category: subscription.category,
        startdate: subscription.startDate.toISOString(),
        nextbillingdate: subscription.nextBillingDate.toISOString(),
        status: subscription.status,
        serviceid: subscription.serviceId,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([supabaseSubscription])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const formattedSubscription = {
          ...data[0],
          nextBillingDate: new Date(data[0].nextbillingdate),
          startDate: new Date(data[0].startdate),
          createdAt: new Date(data[0].createdat),
          updatedAt: new Date(data[0].updatedat),
          billingCycle: data[0].billingcycle,
          serviceId: data[0].serviceid,
        } as Subscription;
        
        setSubscriptions([...subscriptions, formattedSubscription]);
        toast.success(`${subscription.name} subscription added!`);
      }
    } catch (error: any) {
      console.error("Error adding subscription:", error);
      toast.error(error.message || "Failed to add subscription");
    }
  };
  
  const updateSubscription = async (id: string, updatedData: Partial<SubscriptionFormData>) => {
    try {
      // Convert Date objects to ISO strings for Supabase and use lowercase field names
      const supabaseUpdateData: any = {};
      
      // Only include fields that are provided in the updatedData
      if (updatedData.name) supabaseUpdateData.name = updatedData.name;
      if (updatedData.description !== undefined) supabaseUpdateData.description = updatedData.description;
      if (updatedData.url !== undefined) supabaseUpdateData.url = updatedData.url;
      if (updatedData.logo !== undefined) supabaseUpdateData.logo = updatedData.logo;
      if (updatedData.color !== undefined) supabaseUpdateData.color = updatedData.color;
      if (updatedData.cost !== undefined) supabaseUpdateData.cost = updatedData.cost;
      if (updatedData.billingCycle) supabaseUpdateData.billingcycle = updatedData.billingCycle;
      if (updatedData.category) supabaseUpdateData.category = updatedData.category;
      if (updatedData.startDate) supabaseUpdateData.startdate = updatedData.startDate.toISOString();
      if (updatedData.nextBillingDate) supabaseUpdateData.nextbillingdate = updatedData.nextBillingDate.toISOString();
      if (updatedData.status) supabaseUpdateData.status = updatedData.status;
      if (updatedData.serviceId !== undefined) supabaseUpdateData.serviceid = updatedData.serviceId;
      
      // Always update the updatedat timestamp
      supabaseUpdateData.updatedat = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update(supabaseUpdateData)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const formattedSubscription = {
          ...data[0],
          nextBillingDate: new Date(data[0].nextbillingdate),
          startDate: new Date(data[0].startdate),
          createdAt: new Date(data[0].createdat),
          updatedAt: new Date(data[0].updatedat),
          billingCycle: data[0].billingcycle,
          serviceId: data[0].serviceid,
        } as Subscription;
        
        setSubscriptions(subscriptions.map(subscription => {
          if (subscription.id === id) {
            const updatedSubscription = {
              ...subscription,
              ...formattedSubscription
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
      }
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      toast.error(error.message || "Failed to update subscription");
    }
  };
  
  const deleteSubscription = async (id: string) => {
    try {
      const subscription = subscriptions.find(sub => sub.id === id);
      
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSubscriptions(subscriptions.filter(subscription => subscription.id !== id));
      
      if (subscription) {
        toast.success(`${subscription.name} subscription deleted!`);
      }
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast.error(error.message || "Failed to delete subscription");
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

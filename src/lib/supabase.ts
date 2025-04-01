
import { createClient } from '@supabase/supabase-js';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';
import { v4 as uuidv4 } from 'uuid';

// Default values for development - replace these with your actual Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// In-memory storage for subscriptions when not connected to Supabase
let localSubscriptions: Subscription[] = [];
let isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log a warning if using local storage instead of Supabase
if (isUsingLocalStorage) {
  console.warn(
    'Supabase credentials not found. Running in local mode. To connect to Supabase, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getCurrentUser = async () => {
  if (isUsingLocalStorage) {
    // Return a mock user in local mode
    return { id: 'local-user-id', email: 'local@example.com' };
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getSubscriptions = async () => {
  if (isUsingLocalStorage) {
    return localSubscriptions;
  }

  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }

    return data.map(item => ({
      ...item,
      nextBillingDate: new Date(item.nextBillingDate),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })) as Subscription[];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
};

export const addSubscriptionToDb = async (subscription: SubscriptionFormData) => {
  const user = await getCurrentUser();
  if (!user && !isUsingLocalStorage) throw new Error('User not authenticated');

  if (isUsingLocalStorage) {
    // Handle locally
    const newSubscription = {
      ...subscription,
      id: uuidv4(),
      user_id: 'local-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subscription;
    
    localSubscriptions.push(newSubscription);
    return newSubscription;
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        ...subscription,
        user_id: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select();

    if (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }

    return {
      ...data[0],
      nextBillingDate: new Date(data[0].nextBillingDate),
      createdAt: new Date(data[0].createdAt),
      updatedAt: new Date(data[0].updatedAt),
    } as Subscription;
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
};

export const updateSubscriptionInDb = async (id: string, updatedData: Partial<SubscriptionFormData>) => {
  if (isUsingLocalStorage) {
    // Handle locally
    const index = localSubscriptions.findIndex(sub => sub.id === id);
    if (index !== -1) {
      localSubscriptions[index] = {
        ...localSubscriptions[index],
        ...updatedData,
        updatedAt: new Date()
      };
      return localSubscriptions[index];
    }
    throw new Error('Subscription not found');
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        ...updatedData,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    return {
      ...data[0],
      nextBillingDate: new Date(data[0].nextBillingDate),
      createdAt: new Date(data[0].createdAt),
      updatedAt: new Date(data[0].updatedAt),
    } as Subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const deleteSubscriptionFromDb = async (id: string) => {
  if (isUsingLocalStorage) {
    // Handle locally
    localSubscriptions = localSubscriptions.filter(sub => sub.id !== id);
    return;
  }

  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

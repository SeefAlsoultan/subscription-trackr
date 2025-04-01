
import { createClient } from '@supabase/supabase-js';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please add them to your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSubscriptions = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

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
};

export const addSubscriptionToDb = async (subscription: SubscriptionFormData) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      ...subscription,
      user_id: user.id,
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
};

export const updateSubscriptionInDb = async (id: string, updatedData: Partial<SubscriptionFormData>) => {
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
};

export const deleteSubscriptionFromDb = async (id: string) => {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

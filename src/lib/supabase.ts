import { createClient } from '@supabase/supabase-js';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';
import { v4 as uuidv4 } from 'uuid';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// This file now uses the main Supabase client from integrations/supabase/client.ts
export const supabase = supabaseClient;

// In-memory storage for subscriptions as fallback
let localSubscriptions: Subscription[] = [];

// Check if we're using local storage instead of Supabase
const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log a warning if using local storage instead of Supabase
if (isUsingLocalStorage) {
  console.warn(
    'Supabase credentials not found. Running in local mode. To connect to Supabase, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}

export const getCurrentUser = async () => {
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
      id: item.id,
      userId: item.user_id,
      name: item.name,
      description: item.description,
      cost: item.cost,
      billingCycle: item.billingcycle,
      startDate: new Date(item.startdate),
      nextBillingDate: new Date(item.nextbillingdate),
      category: item.category,
      url: item.url,
      logo: item.logo,
      color: item.color,
      status: item.status,
      serviceId: item.serviceid,
      createdAt: new Date(item.createdat),
      updatedAt: new Date(item.updatedat),
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
    const newSubscription = {
      ...subscription,
      id: uuidv4(),
      userId: 'local-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subscription;
    
    localSubscriptions.push(newSubscription);
    return newSubscription;
  }

  try {
    const supabaseSubscription = {
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
      user_id: user?.id,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([supabaseSubscription])
      .select();

    if (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }

    return {
      id: data[0].id,
      userId: data[0].user_id,
      name: data[0].name,
      description: data[0].description,
      cost: data[0].cost,
      billingCycle: data[0].billingcycle,
      startDate: new Date(data[0].startdate),
      nextBillingDate: new Date(data[0].nextbillingdate),
      category: data[0].category,
      url: data[0].url,
      logo: data[0].logo,
      color: data[0].color,
      status: data[0].status,
      serviceId: data[0].serviceid,
      createdAt: new Date(data[0].createdat),
      updatedAt: new Date(data[0].updatedat),
    } as Subscription;
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
};

export const updateSubscriptionInDb = async (id: string, updatedData: Partial<SubscriptionFormData>) => {
  if (isUsingLocalStorage) {
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
    const supabaseUpdateData: any = {};
    
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
    
    supabaseUpdateData.updatedat = new Date().toISOString();

    const { data, error } = await supabase
      .from('subscriptions')
      .update(supabaseUpdateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    return {
      id: data[0].id,
      userId: data[0].user_id,
      name: data[0].name,
      description: data[0].description,
      cost: data[0].cost,
      billingCycle: data[0].billingcycle,
      startDate: new Date(data[0].startdate),
      nextBillingDate: new Date(data[0].nextbillingdate),
      category: data[0].category,
      url: data[0].url,
      logo: data[0].logo,
      color: data[0].color,
      status: data[0].status,
      serviceId: data[0].serviceid,
      createdAt: new Date(data[0].createdat),
      updatedAt: new Date(data[0].updatedat),
    } as Subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const deleteSubscriptionFromDb = async (id: string) => {
  if (isUsingLocalStorage) {
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

/**
 * Create a new user with email and password
 */
export const createUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

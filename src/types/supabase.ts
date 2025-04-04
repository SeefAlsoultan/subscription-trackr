
import { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Extend the original Database type with our tables
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          cost: number;
          billingCycle: string;
          startDate: string;
          nextBillingDate: string;
          category: string;
          url: string | null;
          logo: string | null;
          color: string | null;
          status: string;
          notes: string | null;
          serviceId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          cost: number;
          billingCycle: string;
          startDate: string;
          nextBillingDate: string;
          category: string;
          url?: string | null;
          logo?: string | null;
          color?: string | null;
          status: string;
          notes?: string | null;
          serviceId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          cost?: number;
          billingCycle?: string;
          startDate?: string;
          nextBillingDate?: string;
          category?: string;
          url?: string | null;
          logo?: string | null;
          color?: string | null;
          status?: string;
          notes?: string | null;
          serviceId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    } & OriginalDatabase['public']['Tables'];
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}

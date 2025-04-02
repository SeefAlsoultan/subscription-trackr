
-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2) NOT NULL,
  billingCycle TEXT NOT NULL,
  startDate TIMESTAMP WITH TIME ZONE NOT NULL,
  nextBillingDate TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT,
  url TEXT,
  logo TEXT,
  color TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" 
ON public.subscriptions 
FOR DELETE 
USING (auth.uid() = user_id);


import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [projectRef, setProjectRef] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple query to check if we can connect to Supabase
        const { data, error } = await supabase.from('subscriptions').select('count()', { count: 'exact', head: true });
        
        if (error) throw error;
        
        // Get project ref from the URL
        const supabaseUrl = supabase.supabaseUrl;
        const ref = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || null;
        setProjectRef(ref);
        
        setStatus('connected');
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setError(err.message || 'Unknown error');
      }
    };

    checkConnection();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Supabase Connection Status</CardTitle>
        <CardDescription>
          Checking connection to Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Status:</p>
            {status === 'loading' && <Badge variant="outline">Checking connection...</Badge>}
            {status === 'connected' && <Badge className="bg-green-500">Connected</Badge>}
            {status === 'error' && <Badge variant="destructive">Connection Error</Badge>}
          </div>
          {projectRef && (
            <div>
              <p className="text-sm font-medium mb-1">Project:</p>
              <Badge variant="outline">{projectRef}</Badge>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-800 dark:text-red-200 text-sm">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {status === 'connected' && (
          <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-800 dark:text-green-200 text-sm">
            <p>Successfully connected to Supabase!</p>
            <p className="text-xs mt-1 opacity-80">The application is now using your Supabase database instead of local storage.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;

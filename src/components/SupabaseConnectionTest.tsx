
import { useEffect, useState } from 'react';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [projectRef, setProjectRef] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState({
    url: Boolean(import.meta.env.VITE_SUPABASE_URL),
    key: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  });
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Only attempt the connection check once
        if (hasAttemptedConnection) return;
        setHasAttemptedConnection(true);

        // Check if environment variables are set
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Missing Supabase environment variables. Please check your .env file.');
        }

        // Test connection with our helper function
        const result = await testSupabaseConnection();
        if (!result.success) {
          throw new Error(result.error || 'Failed to connect to Supabase');
        }
        
        // Get project ref from the URL
        const supabaseUrl = new URL(import.meta.env.VITE_SUPABASE_URL);
        const ref = supabaseUrl.hostname.split('.')[0] || null;
        setProjectRef(ref);
        
        setStatus('connected');
        // Do not show toast notification on successful connection
        // This helps prevent unnecessary messages
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setError(err.message || 'Unknown error');
        // Only show a toast if there's a real error that needs user attention
        toast.error('Database connection error. Check console for details.');
      }
    };

    checkConnection();
  }, [hasAttemptedConnection]);

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
        
        <div className="mt-4 p-2 rounded text-sm flex items-start gap-2">
          <div className={`mt-0.5 ${envVars.url ? 'text-green-500' : 'text-red-500'}`}>
            {envVars.url ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          </div>
          <div>
            <span className="font-medium">VITE_SUPABASE_URL:</span> {envVars.url ? 'Found' : 'Missing'}
          </div>
        </div>
        
        <div className="p-2 rounded text-sm flex items-start gap-2">
          <div className={`mt-0.5 ${envVars.key ? 'text-green-500' : 'text-red-500'}`}>
            {envVars.key ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          </div>
          <div>
            <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span> {envVars.key ? 'Found' : 'Missing'}
          </div>
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

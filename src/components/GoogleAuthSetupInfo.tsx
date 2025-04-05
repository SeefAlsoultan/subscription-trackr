
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const GoogleAuthSetupInfo = () => {
  const projectId = "fduqtvljaoahcecihfft";
  const [isConfigured, setIsConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if Google auth is configured by attempting a provider sign-in
    const checkGoogleAuthConfig = async () => {
      try {
        setIsChecking(true);
        
        // More reliable way to check Google provider status - first try a direct API call
        // This doesn't trigger a browser redirect and is more reliable
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true // Prevents the actual redirect
          }
        });
        
        console.log("Google auth check:", data, error);
        
        // If there's no error about provider not being enabled, then Google auth is configured
        const providerEnabled = !(error && error.message && error.message.includes('provider is not enabled'));
        setIsConfigured(providerEnabled);
        
        if (!providerEnabled) {
          setError(error?.message || 'Google provider is not enabled');
        } else {
          setError(null);
        }
      } catch (error: any) {
        console.error("Error checking Google auth configuration:", error);
        setIsConfigured(false);
        setError(error.message || 'Error checking Google authentication');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkGoogleAuthConfig();
  }, []);

  if (isChecking) {
    return (
      <Alert className="my-4 border-blue-500">
        <AlertTitle className="text-blue-500 font-medium flex items-center gap-2">
          Checking Google Authentication Configuration...
        </AlertTitle>
      </Alert>
    );
  }

  if (isConfigured) {
    return (
      <Alert className="my-4 border-green-500">
        <AlertTitle className="text-green-500 font-medium flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Google Authentication Configured
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">Google authentication is properly configured for your Supabase project. Users can now sign in with their Google accounts.</p>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="my-4 border-amber-500">
      <AlertTitle className="text-amber-500 font-medium flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        Google Authentication Not Configured
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">To enable Google authentication, you need to configure it in your Supabase project:</p>
        <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm">
          <li>Go to your Supabase dashboard Authentication → Providers</li>
          <li>Enable Google provider and configure it with your Google client ID and secret</li>
          <li>Create a project in Google Cloud Console and set up OAuth credentials</li>
          <li>Add your app's domain to the authorized domains in Google Cloud Console</li>
          <li>Add the redirect URL from Supabase to your Google OAuth configuration</li>
        </ol>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mb-3">
            <p className="text-sm text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        )}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/auth/providers`, '_blank')}
          >
            Go to Auth Providers <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

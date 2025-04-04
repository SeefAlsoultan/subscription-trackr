
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';

export const GoogleAuthSetupInfo = () => {
  const projectId = "fduqtvljaoahcecihfft";
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    // Check if Google auth is configured by attempting a provider sign-in
    // This will not actually sign in, but will tell us if the provider is enabled
    const checkGoogleAuthConfig = async () => {
      try {
        // We're just checking if the provider is enabled, not actually signing in
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true // This prevents the actual redirect
          }
        });
        
        // If there's no error or if the error doesn't mention "provider is not enabled"
        // then Google auth is likely configured
        setIsConfigured(!error || !error.message.includes('provider is not enabled'));
      } catch (error) {
        console.error("Error checking Google auth configuration:", error);
        setIsConfigured(false);
      }
    };
    
    checkGoogleAuthConfig();
  }, []);

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
      <AlertTitle className="text-amber-500 font-medium">Google Authentication Not Configured</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">To enable Google authentication, you need to configure it in your Supabase project:</p>
        <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm">
          <li>Go to your Supabase dashboard Authentication → Providers</li>
          <li>Enable Google provider and configure it with your Google client ID and secret</li>
          <li>Create a project in Google Cloud Console and set up OAuth credentials</li>
          <li>Add your app's domain to the authorized domains in Google Cloud Console</li>
          <li>Add the redirect URL from Supabase to your Google OAuth configuration</li>
        </ol>
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


import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DevelopmentModeWarning() {
  const [authProviders, setAuthProviders] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  useEffect(() => {
    const checkAuthProviders = async () => {
      try {
        setIsChecking(true);
        // Check Google auth provider without redirecting
        const googleCheck = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { 
            skipBrowserRedirect: true,
            redirectTo: window.location.origin 
          }
        });
        
        const isGoogleEnabled = !googleCheck.error || 
          !googleCheck.error.message.includes('provider is not enabled');
        
        const enabledProviders = [];
        if (isGoogleEnabled) enabledProviders.push('google');
        
        console.log("Auth providers check:", enabledProviders);
        setAuthProviders(enabledProviders);
      } catch (error) {
        console.error("Error checking auth providers:", error);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (!isUsingLocalStorage) {
      checkAuthProviders();
    } else {
      setIsChecking(false);
    }
  }, [isUsingLocalStorage]);
  
  if (isChecking) {
    return null; // Don't show anything while checking
  }
  
  if (isUsingLocalStorage) {
    return (
      <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Development Mode</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Running in local storage mode without Supabase. To enable full functionality, add Supabase credentials to your environment variables.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show warning if Supabase is configured but Google Auth is not
  if (!authProviders.includes('google')) {
    return (
      <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Google Authentication Not Configured</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Supabase is connected, but Google authentication is not properly configured. Make sure you have:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>Enabled Google provider in your Supabase dashboard</li>
                <li>Added the correct Google Client ID and Secret</li>
                <li>Added the correct redirect URLs to both Supabase and Google Cloud console</li>
                <li>Configured correct authorized domains in Google Cloud console</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If both Supabase and Google auth are configured, don't show any warning
  return null;
}

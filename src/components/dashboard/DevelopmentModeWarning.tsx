
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DevelopmentModeWarning() {
  const [authProviders, setAuthProviders] = useState<string[]>([]);
  const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  useEffect(() => {
    const checkAuthProviders = async () => {
      try {
        // This is a hacky way to check which providers are enabled by trying to sign in with each
        // In a production app, you would have a proper admin API to check this
        const googlePromise = supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { skipBrowserRedirect: true }
        }).then(({ error }) => !error || !error.message.includes('provider is not enabled') ? 'google' : null);
        
        // Add more provider checks here if needed
        
        const enabledProviders = (await Promise.all([googlePromise]))
          .filter(Boolean) as string[];
          
        setAuthProviders(enabledProviders);
      } catch (error) {
        console.error("Error checking auth providers:", error);
      }
    };
    
    if (!isUsingLocalStorage) {
      checkAuthProviders();
    }
  }, [isUsingLocalStorage]);
  
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
                Supabase is connected, but Google authentication is not properly configured. Users won't be able to sign in with Google until you set it up in your Supabase dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If both Supabase and Google auth are configured, don't show any warning
  return null;
}

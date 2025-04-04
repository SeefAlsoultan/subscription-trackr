
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export const GoogleAuthSetupInfo = () => {
  const projectId = "fduqtvljaoahcecihfft";
  
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

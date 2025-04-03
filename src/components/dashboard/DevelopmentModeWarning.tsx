
import { Card, CardContent } from "@/components/ui/card";

export function DevelopmentModeWarning() {
  return (
    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600 dark:text-amber-400"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
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


import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, getAuthRedirectUrl } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, LogOut, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PageTransition from '@/components/PageTransition';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GoogleAuthSetupInfo } from '@/components/GoogleAuthSetupInfo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User already has a session, redirecting to dashboard');
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('Login successful:', data);
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleError(null);
      setGoogleLoading(true);
      
      const redirectUrl = getAuthRedirectUrl();
      
      console.log('Starting Google sign-in with redirect to:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        },
      });

      if (error) {
        console.error('Google sign-in error details:', error);
        if (error.message.includes('provider is not enabled')) {
          toast.error('Google authentication is not properly configured');
        } else {
          toast.error(error.message || 'Google sign-in failed');
        }
        setGoogleError(error.message);
        throw error;
      }
      
      console.log('Google sign-in initiated successfully:', data);
      toast.info('Redirecting to Google for authentication...');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setGoogleError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </div>
        
        <Card className="w-full max-w-md bg-card/95 border-border shadow-xl mt-10">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your subscription dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {googleError && googleError.includes("provider is not enabled") && (
              <GoogleAuthSetupInfo />
            )}

            <Button 
              type="button" 
              className="w-full bg-white text-gray-800 hover:bg-gray-100 h-12" 
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Continue with Google
            </Button>
            
            <div className="flex items-center gap-4 py-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 h-12"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground h-12 mt-2" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                  Login with Email
                </Button>
                
                <div className="text-center text-sm text-muted-foreground mt-4 pt-2">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;

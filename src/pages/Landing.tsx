
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      
      if (user) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoggedIn === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold">SubscriptionTrackr</div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Manage All Your Subscriptions in One Place</h1>
          <p className="text-xl mb-12 text-gray-300">
            Track, manage, and optimize your subscription spending with our easy-to-use dashboard.
            Never miss a renewal or overpay for services again.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg">
                Get Started - It's Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Login to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Track Everything</h3>
              <p className="text-gray-300">Keep all your subscriptions organized in one dashboard with renewal alerts.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Save Money</h3>
              <p className="text-gray-300">Identify unused services and reduce unnecessary spending on subscriptions.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Never Miss a Renewal</h3>
              <p className="text-gray-300">Get timely notifications before you're charged for any subscription.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;

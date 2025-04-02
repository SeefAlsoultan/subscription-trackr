
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, CheckCircle2, DollarSign, BellRing } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

// Check if we're using local storage mode
const isUsingLocalStorage = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // If in local mode, consider the dev environment doesn't need to check auth
    if (isUsingLocalStorage) {
      setIsLoggedIn(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
        
        if (user) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoggedIn === null && !isUsingLocalStorage) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden">
        {isUsingLocalStorage && (
          <Alert variant="destructive" className="mb-6 max-w-4xl mx-auto mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Development Mode</AlertTitle>
            <AlertDescription>
              Running in local storage mode without Supabase. To enable full functionality, add Supabase credentials to your environment variables.
            </AlertDescription>
          </Alert>
        )}

        <header className="sticky top-0 z-10 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              SubscriptionTrackr
            </motion.div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto text-center max-w-4xl">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Take Control of Your <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Subscriptions</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Track, manage, and optimize your subscription spending with our easy-to-use dashboard.
                Never miss a renewal or overpay for services again.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg group">
                    Get Started - It's Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={scrollToFeatures}
                >
                  Learn More
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="relative"
              >
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl shadow-2xl border border-gray-700">
                  <div className="bg-gray-800 p-1">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="overflow-hidden">
                      <motion.img 
                        src="/placeholder.svg" 
                        alt="Dashboard Preview" 
                        className="w-full" 
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="py-20 px-4 bg-gray-800">
            <div className="container mx-auto max-w-6xl">
              <motion.h2 
                className="text-4xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Why Choose SubscriptionTrackr?
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <motion.div 
                  className="bg-gray-700/50 backdrop-blur-sm p-8 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(155, 135, 245, 0.5)" }}
                >
                  <CheckCircle2 className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">Track Everything</h3>
                  <p className="text-gray-300">Keep all your subscriptions organized in one dashboard with renewal alerts.</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-700/50 backdrop-blur-sm p-8 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(155, 135, 245, 0.5)" }}
                >
                  <DollarSign className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">Save Money</h3>
                  <p className="text-gray-300">Identify unused services and reduce unnecessary spending on subscriptions.</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-700/50 backdrop-blur-sm p-8 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(155, 135, 245, 0.5)" }}
                >
                  <BellRing className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-3">Never Miss a Renewal</h3>
                  <p className="text-gray-300">Get timely notifications before you're charged for any subscription.</p>
                </motion.div>
              </div>
              
              <motion.div 
                className="text-center mt-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to="/register">
                  <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
                    Start Tracking Your Subscriptions
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
          
          {/* How it Works Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <motion.h2 
                className="text-4xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                How It Works
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-purple-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sign Up</h3>
                  <p className="text-gray-300">Create your free account in less than a minute.</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="bg-purple-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Add Subscriptions</h3>
                  <p className="text-gray-300">Easily add and categorize all your subscription services.</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-purple-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Monitor & Save</h3>
                  <p className="text-gray-300">Get insights, track renewals, and optimize your spending.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-24 px-4 bg-gradient-to-r from-purple-800 to-pink-800">
            <div className="container mx-auto text-center max-w-4xl">
              <motion.h2 
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to take control of your subscriptions?
              </motion.h2>
              
              <motion.p 
                className="text-xl mb-10 text-gray-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of users who have already saved money by managing their subscriptions better.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to="/register">
                  <Button size="lg" className="text-lg px-10 py-6 bg-white text-purple-800 hover:bg-gray-100 shadow-lg">
                    Get Started for Free
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} SubscriptionTrackr. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Landing;

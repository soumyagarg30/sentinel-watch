import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { lovable } from '@/integrations/lovable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const roles = [
  { id: 'agent', label: 'AGENT', description: 'Handle live calls' },
  { id: 'supervisor', label: 'SUPERVISOR', description: 'Monitor team performance' },
  { id: 'admin', label: 'ADMIN', description: 'System configuration' },
  { id: 'ml-engineer', label: 'ML ENGINEER', description: 'Model analytics' },
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('agent');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Sync user to MongoDB
        await syncUserToMongoDB(session);
        navigate('/dashboard');
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Sync user to MongoDB after login
        setTimeout(() => {
          syncUserToMongoDB(session);
        }, 0);
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const syncUserToMongoDB = async (session: { access_token: string; user: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } }) => {
    try {
      const selectedRole = localStorage.getItem('voicesentinel_selected_role') || 'agent';
      
      const response = await supabase.functions.invoke('sync-user-mongodb', {
        body: {
          action: 'sync_login',
          userData: {
            email: session.user.email,
            name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: selectedRole,
            provider: 'google',
          }
        }
      });

      if (response.error) {
        console.error('Failed to sync user to MongoDB:', response.error);
      } else {
        console.log('User synced to MongoDB:', response.data);
      }
    } catch (error) {
      console.error('Error syncing user to MongoDB:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Store selected role in localStorage for later use
      localStorage.setItem('voicesentinel_selected_role', selectedRole);
      
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin + '/login'
      });
      
      if (result.error) {
        toast({
          title: "Authentication Failed",
          description: result.error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Scan Lines */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="relative">
              <Shield className="w-10 h-10 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full blur-lg"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="font-display text-2xl tracking-wider">VOICESENTINEL</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" glow="primary">
            <GlassCardContent className="p-6">
              <h1 className="font-display text-2xl tracking-wider text-center mb-2">SECURE LOGIN</h1>
              <p className="text-xs font-mono text-muted-foreground text-center mb-6">
                ACCESS CONTROL TERMINAL
              </p>

              <div className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <p className="text-xs font-mono tracking-wider text-muted-foreground">
                    SELECT ROLE
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-3 rounded border text-left transition-all ${
                          selectedRole === role.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        <div className="text-xs font-mono font-semibold tracking-wider">{role.label}</div>
                        <div className="text-[10px] font-mono opacity-70">{role.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Google Sign In */}
                <Button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full font-mono text-sm tracking-wider gap-3 h-12"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {isLoading ? 'AUTHENTICATING...' : 'SIGN IN WITH GOOGLE'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-[10px] font-mono text-muted-foreground text-center">
                  Your selected role will be applied after authentication
                </p>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs font-mono text-muted-foreground mt-6"
        >
          ENCRYPTED CONNECTION • SESSION MONITORED
        </motion.p>
      </div>
    </div>
  );
};

export default Login;

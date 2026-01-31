import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CallerProfile } from '@/components/dashboard/CallerProfile';
import { RiskPanel } from '@/components/dashboard/RiskPanel';
import { ActionControls } from '@/components/dashboard/ActionControls';
import { RecentCalls } from '@/components/dashboard/RecentCalls';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Headphones, Radio, PhoneOff, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { CallerData, RiskData, CallRecord } from '@/types/dashboard';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { supabase } from '@/integrations/supabase/client';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [currentCaller, setCurrentCaller] = useState<CallerData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('agent');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      const savedRole = localStorage.getItem('voicesentinel_selected_role') || 'agent';
      setUserRole(savedRole);
      
      // Redirect admin to admin dashboard
      if (savedRole === 'admin') {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleCallClick = (callId: string) => {
    console.log('Call clicked:', callId);
  };

  // Stats for the agent
  const agentStats = [
    { label: 'CALLS TODAY', value: '0', icon: Headphones, color: 'text-primary' },
    { label: 'FLAGGED', value: '0', icon: AlertTriangle, color: 'text-warning' },
    { label: 'VERIFIED', value: '0', icon: CheckCircle, color: 'text-success' },
    { label: 'AVG DURATION', value: '--:--', icon: Clock, color: 'text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl sm:text-4xl tracking-wider">AGENT DASHBOARD</h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">LIVE CALL MONITORING & FRAUD DETECTION</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-success animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">SYSTEM ONLINE</span>
              </div>
              {isCallActive ? (
                <StatusBadge status="info" label="CALL IN PROGRESS" pulse />
              ) : (
                <StatusBadge status="medium" label="AWAITING CALL" />
              )}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {agentStats.map((stat) => (
              <GlassCard key={stat.label} variant="default">
                <GlassCardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="font-display text-2xl tracking-wider">{stat.value}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </motion.div>

          {/* Dashboard Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Caller Info & Controls */}
            <motion.div variants={itemVariants} className="space-y-6">
              <CallerProfile caller={currentCaller} isLoading={isLoading} />
              <ActionControls disabled={!isCallActive} />
            </motion.div>

            {/* Center Column - Risk Analysis */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <RiskPanel data={riskData} isLoading={isLoading} />
            </motion.div>

            {/* Right Column - Recent Activity */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Call Status */}
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {isCallActive ? (
                      <>
                        <Headphones className="w-8 h-8 text-primary" />
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </>
                    ) : (
                      <PhoneOff className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-lg tracking-wider">
                      {isCallActive ? 'CALL ACTIVE' : 'NO ACTIVE CALL'}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {isCallActive ? `${callDuration} ELAPSED` : 'WAITING FOR CONNECTION'}
                    </p>
                  </div>
                </div>
              </div>

              <RecentCalls 
                calls={recentCalls} 
                isLoading={isLoading}
                onCallClick={handleCallClick}
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;

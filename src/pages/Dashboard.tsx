import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { CallerProfile } from '@/components/dashboard/CallerProfile';
import { RiskPanel } from '@/components/dashboard/RiskPanel';
import { ActionControls } from '@/components/dashboard/ActionControls';
import { RecentCalls } from '@/components/dashboard/RecentCalls';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Headphones, Radio, PhoneOff } from 'lucide-react';
import { CallerData, RiskData, CallRecord } from '@/types/dashboard';

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

const Dashboard = () => {
  // State for live data - initially null/empty, will be populated by API
  const [currentCaller, setCurrentCaller] = useState<CallerData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with real-time data fetching
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Fetch current call data
  //       // Fetch recent calls
  //       // Subscribe to real-time updates
  //     } catch (error) {
  //       console.error('Failed to fetch dashboard data:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchDashboardData();
  // }, []);

  const handleCallClick = (callId: string) => {
    // Navigate to call detail or load call data
    console.log('Call clicked:', callId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
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
              <p className="text-sm font-mono text-muted-foreground mt-1">LIVE CALL MONITORING</p>
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

export default Dashboard;

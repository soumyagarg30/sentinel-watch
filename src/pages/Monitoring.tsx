import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { SignalBar } from '@/components/ui/SignalBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SystemMetrics, ResourceUsage, RiskDistribution } from '@/types/dashboard';
import { Activity, Phone, AlertTriangle, XCircle, Clock, Cpu, BarChart3, Database } from 'lucide-react';

interface StatCardProps {
  icon: any;
  label: string;
  value: number | string | null;
  unit?: string;
  color?: string;
  isLoading?: boolean;
}

const StatCard = ({ icon: Icon, label, value, unit, color, isLoading }: StatCardProps) => (
  <GlassCard variant="elevated">
    <GlassCardContent className="p-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <LoadingState message="" className="py-2" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-muted-foreground tracking-wider">{label}</p>
            <p className={`font-display text-3xl mt-1 ${color || 'text-foreground'}`}>
              {value ?? '--'}
              {unit && value !== null && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
            </p>
          </div>
          <Icon className={`w-8 h-8 ${color || 'text-primary'} opacity-50`} />
        </div>
      )}
    </GlassCardContent>
  </GlassCard>
);

const Monitoring = () => {
  // State for live data - initially null, will be populated by API
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage | null>(null);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with real-time data fetching
  // useEffect(() => {
  //   const fetchMetrics = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Fetch system metrics
  //       // Subscribe to real-time updates
  //     } catch (error) {
  //       console.error('Failed to fetch metrics:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchMetrics();
  // }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider">SYSTEM MONITORING</h1>
            <p className="text-sm font-mono text-muted-foreground mt-1">REAL-TIME OPERATIONS</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard 
              icon={Phone} 
              label="CALLS TODAY" 
              value={metrics?.callsToday?.toLocaleString() ?? null}
              isLoading={isLoading}
            />
            <StatCard 
              icon={BarChart3} 
              label="AVG RISK SCORE" 
              value={metrics?.avgRiskScore ?? null} 
              color="text-risk-medium"
              isLoading={isLoading}
            />
            <StatCard 
              icon={AlertTriangle} 
              label="FRAUD CAUGHT" 
              value={metrics?.fraudCaught ?? null} 
              color="text-destructive"
              isLoading={isLoading}
            />
            <StatCard 
              icon={XCircle} 
              label="FALSE POSITIVES" 
              value={metrics?.falsePositives ?? null} 
              color="text-warning"
              isLoading={isLoading}
            />
          </motion.div>

          {/* Latency Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            <GlassCard variant="elevated">
              <GlassCardHeader className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs tracking-wider text-muted-foreground">SYSTEM LATENCY</span>
              </GlassCardHeader>
              <GlassCardContent>
                {isLoading ? (
                  <LoadingState message="LOADING LATENCY DATA..." />
                ) : !metrics ? (
                  <EmptyState 
                    icon={Clock}
                    title="NO LATENCY DATA"
                    description="System latency metrics will appear when data is available"
                  />
                ) : (
                  <div className="space-y-4">
                    <SignalBar label="End-to-End" value={metrics.systemLatency} maxValue={100} status="low" delay={0.1} />
                    <SignalBar label="ASR Processing" value={metrics.asrLatency} maxValue={100} status="low" delay={0.2} />
                    <SignalBar label="ML Inference" value={metrics.mlInferenceTime} maxValue={100} status="low" delay={0.3} />
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="elevated">
              <GlassCardHeader className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs tracking-wider text-muted-foreground">RESOURCE USAGE</span>
              </GlassCardHeader>
              <GlassCardContent>
                {isLoading ? (
                  <LoadingState message="LOADING RESOURCE DATA..." />
                ) : !resourceUsage ? (
                  <EmptyState 
                    icon={Cpu}
                    title="NO RESOURCE DATA"
                    description="Resource usage metrics will appear when data is available"
                  />
                ) : (
                  <div className="space-y-4">
                    <SignalBar label="CPU" value={resourceUsage.cpu} maxValue={100} delay={0.1} />
                    <SignalBar label="Memory" value={resourceUsage.memory} maxValue={100} delay={0.2} />
                    <SignalBar label="GPU" value={resourceUsage.gpu} maxValue={100} delay={0.3} />
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Risk Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard variant="elevated">
              <GlassCardHeader className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs tracking-wider text-muted-foreground">RISK DISTRIBUTION (LAST 24H)</span>
              </GlassCardHeader>
              <GlassCardContent>
                {isLoading ? (
                  <LoadingState message="LOADING DISTRIBUTION DATA..." />
                ) : riskDistribution.length === 0 ? (
                  <EmptyState 
                    icon={Database}
                    title="NO DISTRIBUTION DATA"
                    description="Risk distribution chart will appear when call data is available"
                  />
                ) : (
                  <>
                    <div className="h-64 flex items-end justify-around gap-2 pt-8">
                      {riskDistribution.map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-primary/80 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.count / Math.max(...riskDistribution.map(d => d.count))) * 100}%` }}
                          transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs font-mono text-muted-foreground mt-4">
                      {riskDistribution.map((item, i) => (
                        <span key={i}>{item.range}</span>
                      ))}
                    </div>
                    <p className="text-center text-xs font-mono text-muted-foreground mt-2">RISK SCORE RANGE</p>
                  </>
                )}
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Monitoring;

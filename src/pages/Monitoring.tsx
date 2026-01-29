import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { SignalBar } from '@/components/ui/SignalBar';
import { mockSystemMetrics } from '@/data/mockData';
import { Activity, Phone, AlertTriangle, XCircle, Clock, Cpu, BarChart3 } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, color }: { 
  icon: any; 
  label: string; 
  value: number | string; 
  unit?: string;
  color?: string;
}) => (
  <GlassCard variant="elevated">
    <GlassCardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-wider">{label}</p>
          <p className={`font-display text-3xl mt-1 ${color || 'text-foreground'}`}>
            {value}
            {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${color || 'text-primary'} opacity-50`} />
      </div>
    </GlassCardContent>
  </GlassCard>
);

const Monitoring = () => {
  const metrics = mockSystemMetrics;

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
            <StatCard icon={Phone} label="CALLS TODAY" value={metrics.callsToday.toLocaleString()} />
            <StatCard icon={BarChart3} label="AVG RISK SCORE" value={metrics.avgRiskScore} color="text-risk-medium" />
            <StatCard icon={AlertTriangle} label="FRAUD CAUGHT" value={metrics.fraudCaught} color="text-destructive" />
            <StatCard icon={XCircle} label="FALSE POSITIVES" value={metrics.falsePositives} color="text-warning" />
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
              <GlassCardContent className="space-y-4">
                <SignalBar label="End-to-End" value={metrics.systemLatency} maxValue={100} status="low" delay={0.1} />
                <SignalBar label="ASR Processing" value={metrics.asrLatency} maxValue={100} status="low" delay={0.2} />
                <SignalBar label="ML Inference" value={metrics.mlInferenceTime} maxValue={100} status="low" delay={0.3} />
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="elevated">
              <GlassCardHeader className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs tracking-wider text-muted-foreground">RESOURCE USAGE</span>
              </GlassCardHeader>
              <GlassCardContent className="space-y-4">
                <SignalBar label="CPU" value={45} maxValue={100} delay={0.1} />
                <SignalBar label="Memory" value={62} maxValue={100} delay={0.2} />
                <SignalBar label="GPU" value={38} maxValue={100} delay={0.3} />
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Risk Distribution Chart Placeholder */}
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
                <div className="h-64 flex items-end justify-around gap-2 pt-8">
                  {[15, 28, 42, 35, 22, 18, 45, 38, 25, 12, 8, 5].map((value, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-primary/80 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${value * 2}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs font-mono text-muted-foreground mt-4">
                  <span>0-10</span>
                  <span>11-20</span>
                  <span>21-30</span>
                  <span>31-40</span>
                  <span>41-50</span>
                  <span>51-60</span>
                  <span>61-70</span>
                  <span>71-80</span>
                  <span>81-90</span>
                  <span>91-100</span>
                </div>
                <p className="text-center text-xs font-mono text-muted-foreground mt-2">RISK SCORE RANGE</p>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Monitoring;

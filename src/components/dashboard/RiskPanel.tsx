import { motion } from 'framer-motion';
import { AlertTriangle, Info, Zap, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { RiskMeter } from '@/components/ui/RiskMeter';
import { SignalBar } from '@/components/ui/SignalBar';
import { Waveform } from '@/components/ui/Waveform';
import { mockRiskData } from '@/data/mockData';
import { cn } from '@/lib/utils';

const recommendationConfig = {
  FAST_LANE: { icon: Zap, label: 'FAST LANE', color: 'text-success', bg: 'bg-success/20', border: 'border-success/50' },
  COGNITIVE_TEST: { icon: AlertTriangle, label: 'COGNITIVE TEST', color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50' },
  STEP_UP: { icon: ShieldCheck, label: 'STEP-UP VERIFICATION', color: 'text-risk-high', bg: 'bg-risk-high/20', border: 'border-risk-high/50' },
  BLOCK: { icon: AlertCircle, label: 'BLOCK CALL', color: 'text-risk-critical', bg: 'bg-risk-critical/20', border: 'border-risk-critical/50' },
};

export const RiskPanel = () => {
  const data = mockRiskData;
  const rec = recommendationConfig[data.recommendation];
  const RecIcon = rec.icon;

  return (
    <GlassCard 
      variant="elevated" 
      glow={data.overallScore > 70 ? 'destructive' : data.overallScore > 40 ? 'warning' : 'none'}
      className="h-full"
    >
      <GlassCardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="font-mono text-xs tracking-wider text-muted-foreground">RISK ANALYSIS</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          CONFIDENCE: <span className="text-foreground">{(data.confidence * 100).toFixed(0)}%</span>
        </span>
      </GlassCardHeader>
      <GlassCardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Risk Meter */}
          <div className="flex justify-center">
            <RiskMeter value={data.overallScore} size="lg" />
          </div>

          {/* Waveform */}
          <div className="py-2">
            <Waveform 
              bars={28} 
              color={data.overallScore > 70 ? 'destructive' : data.overallScore > 40 ? 'warning' : 'primary'} 
            />
          </div>

          {/* Signal Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-wider text-muted-foreground mb-3">SIGNAL BREAKDOWN</h4>
            <SignalBar label="Cognitive Load" value={data.signals.cognitiveLoad} delay={0.1} />
            <SignalBar label="Behavioral Match" value={data.signals.behavioralMatch} delay={0.2} />
            <SignalBar label="Environment" value={data.signals.environmentalConsistency} delay={0.3} />
            <SignalBar label="Liveness" value={data.signals.livenessScore} delay={0.4} />
          </div>

          {/* Flags */}
          {data.flags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono tracking-wider text-muted-foreground">DETECTION FLAGS</h4>
              {data.flags.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded text-xs font-mono',
                    flag.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                  )}
                >
                  {flag.type === 'warning' ? <AlertTriangle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                  {flag.message}
                </motion.div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={cn(
              'p-4 rounded-lg border-2 text-center',
              rec.bg,
              rec.border
            )}
          >
            <RecIcon className={cn('w-8 h-8 mx-auto mb-2', rec.color)} />
            <div className={cn('font-display text-xl tracking-wider', rec.color)}>
              {rec.label}
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              RECOMMENDED ACTION
            </p>
          </motion.div>
        </motion.div>
      </GlassCardContent>
    </GlassCard>
  );
};

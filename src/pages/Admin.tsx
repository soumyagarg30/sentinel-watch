import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Sliders, AlertTriangle, Mic, Volume2, Save } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState({
    lowRisk: 25,
    mediumRisk: 50,
    highRisk: 75,
  });
  const [weights, setWeights] = useState({
    cognitive: 25,
    behavioral: 30,
    environmental: 20,
    liveness: 25,
  });
  const [settings, setSettings] = useState({
    autoEscalate: true,
    challengeInjection: true,
    replayDetection: true,
    ttsDetection: true,
  });

  const handleSave = () => {
    toast({
      title: 'CONFIGURATION SAVED',
      description: 'System settings have been updated successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="font-display text-3xl sm:text-4xl tracking-wider">ADMIN PANEL</h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">SYSTEM CONFIGURATION</p>
            </div>
            <Button onClick={handleSave} className="font-mono text-xs gap-2">
              <Save className="w-4 h-4" />
              SAVE CHANGES
            </Button>
          </motion.div>

          <div className="space-y-6">
            {/* Threshold Tuning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard variant="elevated">
                <GlassCardHeader className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">RISK THRESHOLDS</span>
                </GlassCardHeader>
                <GlassCardContent className="space-y-6">
                  {Object.entries(thresholds).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <span className="font-mono text-sm text-primary">{value}</span>
                      </div>
                      <Slider
                        value={[value]}
                        max={100}
                        step={1}
                        onValueChange={([v]) => setThresholds({ ...thresholds, [key]: v })}
                        className="w-full"
                      />
                    </div>
                  ))}
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Weight Sliders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard variant="elevated">
                <GlassCardHeader className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">SIGNAL WEIGHTS</span>
                </GlassCardHeader>
                <GlassCardContent className="space-y-6">
                  {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                          {key} LOAD
                        </Label>
                        <span className="font-mono text-sm text-primary">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        max={100}
                        step={1}
                        onValueChange={([v]) => setWeights({ ...weights, [key]: v })}
                        className="w-full"
                      />
                    </div>
                  ))}
                  <p className="text-xs font-mono text-muted-foreground">
                    Total: {Object.values(weights).reduce((a, b) => a + b, 0)}% (should equal 100%)
                  </p>
                </GlassCardContent>
              </GlassCard>
            </motion.div>

            {/* Feature Toggles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard variant="elevated">
                <GlassCardHeader className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">DETECTION FEATURES</span>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {key === 'challengeInjection' ? <Mic className="w-4 h-4 text-muted-foreground" /> : 
                         key === 'replayDetection' ? <Volume2 className="w-4 h-4 text-muted-foreground" /> :
                         <Settings className="w-4 h-4 text-muted-foreground" />}
                        <Label className="text-sm font-mono tracking-wider">
                          {key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                        </Label>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
                      />
                    </div>
                  ))}
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

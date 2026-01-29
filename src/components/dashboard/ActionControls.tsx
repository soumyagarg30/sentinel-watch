import { motion } from 'framer-motion';
import { Send, FileText, RefreshCw, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { useToast } from '@/hooks/use-toast';

const actions = [
  { icon: Send, label: 'SEND OTP', description: 'SMS verification code', variant: 'default' as const },
  { icon: FileText, label: 'REQUEST DOCUMENT', description: 'ID verification', variant: 'secondary' as const },
  { icon: RefreshCw, label: 'OVERRIDE', description: 'Manual approval', variant: 'outline' as const },
  { icon: Mic, label: 'INJECT CHALLENGE', description: 'Voice liveness test', variant: 'destructive' as const },
];

export const ActionControls = () => {
  const { toast } = useToast();

  const handleAction = (label: string) => {
    toast({
      title: `${label} INITIATED`,
      description: 'Action has been triggered successfully.',
    });
  };

  return (
    <GlassCard variant="elevated" className="h-full">
      <GlassCardHeader>
        <span className="font-mono text-xs tracking-wider text-muted-foreground">AGENT CONTROLS</span>
      </GlassCardHeader>
      <GlassCardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-3"
        >
          {actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Button
                variant={action.variant}
                className="w-full h-auto flex flex-col items-center gap-2 py-4 font-mono"
                onClick={() => handleAction(action.label)}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-xs tracking-wider">{action.label}</span>
                <span className="text-[10px] opacity-70">{action.description}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </GlassCardContent>
    </GlassCard>
  );
};

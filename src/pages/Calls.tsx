import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockRecentCalls } from '@/data/mockData';
import { Phone, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const getRiskStatus = (risk: number) => {
  if (risk <= 25) return 'low';
  if (risk <= 50) return 'medium';
  if (risk <= 75) return 'high';
  return 'critical';
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'flagged': return 'warning';
    case 'escalated': return 'critical';
    default: return 'info';
  }
};

// Expanded mock calls for the calls page
const expandedCalls = [
  ...mockRecentCalls,
  { id: 'CALL-9816', caller: 'David Miller', risk: 15, status: 'completed', time: '09:42 AM' },
  { id: 'CALL-9815', caller: 'Jennifer Davis', risk: 56, status: 'flagged', time: '09:28 AM' },
  { id: 'CALL-9814', caller: 'Christopher Lee', risk: 8, status: 'completed', time: '09:15 AM' },
  { id: 'CALL-9813', caller: 'Amanda Wilson', risk: 82, status: 'escalated', time: '09:01 AM' },
  { id: 'CALL-9812', caller: 'James Taylor', risk: 29, status: 'completed', time: '08:48 AM' },
];

const Calls = () => {
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
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider">CALL LOG</h1>
            <p className="text-sm font-mono text-muted-foreground mt-1">ALL PROCESSED CALLS</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by caller name or ID..." 
                className="pl-10 font-mono text-sm bg-muted/30"
              />
            </div>
            <Button variant="outline" className="font-mono text-xs gap-2">
              <Filter className="w-4 h-4" />
              FILTERS
            </Button>
            <Button variant="outline" className="font-mono text-xs gap-2">
              <ArrowUpDown className="w-4 h-4" />
              SORT
            </Button>
          </motion.div>

          {/* Calls Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="elevated">
              <GlassCardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">
                    {expandedCalls.length} CALLS TODAY
                  </span>
                </div>
              </GlassCardHeader>
              <GlassCardContent className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider">CALL ID</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider">CALLER</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider">RISK</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider">STATUS</th>
                      <th className="text-left px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider">TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expandedCalls.map((call, i) => (
                      <motion.tr
                        key={call.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-sm text-primary">{call.id}</td>
                        <td className="px-4 py-3 text-sm">{call.caller}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={getRiskStatus(call.risk)} label={`${call.risk}`} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={getStatusType(call.status) as any} label={call.status.toUpperCase()} />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{call.time}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Calls;

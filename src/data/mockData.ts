// Mock data for the dashboard
export const mockCallerData = {
  id: 'CLR-7842',
  name: 'John M. Peterson',
  phone: '+1 (555) 123-4567',
  accountNumber: '****4823',
  lastVerified: '2024-01-15',
  callsThisMonth: 3,
  riskHistory: 'Low',
  intent: 'Account Inquiry',
  callDuration: '02:34',
  status: 'active' as const,
};

export const mockRiskData = {
  overallScore: 67,
  confidence: 0.89,
  signals: {
    cognitiveLoad: 45,
    behavioralMatch: 72,
    environmentalConsistency: 58,
    livenessScore: 93,
  },
  recommendation: 'COGNITIVE_TEST' as const,
  flags: [
    { type: 'warning', message: 'Unusual pause patterns detected' },
    { type: 'info', message: 'Background noise level elevated' },
  ],
};

export const mockRecentCalls = [
  { id: 'CALL-9821', caller: 'Sarah Johnson', risk: 23, status: 'completed', time: '10:45 AM' },
  { id: 'CALL-9820', caller: 'Mike Williams', risk: 78, status: 'flagged', time: '10:32 AM' },
  { id: 'CALL-9819', caller: 'Emily Chen', risk: 12, status: 'completed', time: '10:21 AM' },
  { id: 'CALL-9818', caller: 'Robert Brown', risk: 91, status: 'escalated', time: '10:08 AM' },
  { id: 'CALL-9817', caller: 'Lisa Anderson', risk: 34, status: 'completed', time: '09:55 AM' },
];

export const mockSystemMetrics = {
  callsToday: 1847,
  avgRiskScore: 32,
  fraudCaught: 12,
  falsePositives: 3,
  systemLatency: 42,
  asrLatency: 18,
  mlInferenceTime: 24,
};

export const mockAuditLog = [
  { id: 'AUD-001', callId: 'CALL-9820', agentId: 'AGT-102', risk: 78, action: 'STEP_UP', override: false, time: '10:32 AM' },
  { id: 'AUD-002', callId: 'CALL-9818', agentId: 'AGT-105', risk: 91, action: 'ESCALATE', override: true, time: '10:08 AM' },
  { id: 'AUD-003', callId: 'CALL-9815', agentId: 'AGT-102', risk: 45, action: 'COGNITIVE_TEST', override: false, time: '09:42 AM' },
];

export const mockModelMetrics = {
  cognitiveLoad: { precision: 0.94, recall: 0.89, f1: 0.91 },
  behavioral: { eer: 0.032, precision: 0.96, recall: 0.91 },
  environmental: { precision: 0.88, recall: 0.92, f1: 0.90 },
  liveness: { precision: 0.97, recall: 0.94, f1: 0.95 },
};

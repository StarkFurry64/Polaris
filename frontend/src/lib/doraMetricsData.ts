// Mock data service for LinearB-style Software Delivery Intelligence
// This provides all the data for DORA metrics, PR analytics, and developer stats

export interface DORAMetric {
  name: string;
  current: number | string;
  target: number | string;
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  rating: 'elite' | 'high' | 'medium' | 'low';
  unit: string;
}

export interface PRData {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
  mergedAt?: string;
  reviewers: string[];
  linesAdded: number;
  linesRemoved: number;
  cycleTime: {
    coding: number; // hours
    review: number;
    merge: number;
    total: number;
  };
  labels: string[];
  repository: string;
}

export interface DeveloperStats {
  id: string;
  name: string;
  avatar: string;
  team: string;
  commits: number;
  prsOpened: number;
  prsMerged: number;
  reviewsGiven: number;
  avgReviewTime: number; // hours
  linesOfCode: number;
  impactScore: number;
}

export interface BottleneckData {
  stage: string;
  avgTime: number;
  prsStuck: number;
  severity: 'critical' | 'warning' | 'normal';
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  executions: number;
  lastTriggered: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  metric?: string;
}

// DORA Metrics Data
export const doraMetrics: DORAMetric[] = [
  {
    name: 'Deployment Frequency',
    current: 4.2,
    target: 5,
    trend: '+12%',
    trendDirection: 'up',
    rating: 'elite',
    unit: 'per day',
  },
  {
    name: 'Lead Time for Changes',
    current: 2.3,
    target: 2,
    trend: '-8%',
    trendDirection: 'down',
    rating: 'high',
    unit: 'days',
  },
  {
    name: 'Mean Time to Recovery',
    current: 45,
    target: 30,
    trend: '-15%',
    trendDirection: 'down',
    rating: 'high',
    unit: 'minutes',
  },
  {
    name: 'Change Failure Rate',
    current: 3.2,
    target: 5,
    trend: '-0.8%',
    trendDirection: 'down',
    rating: 'elite',
    unit: '%',
  },
];

// Deployment frequency trend data
export const deploymentTrendData = [
  { date: 'Mon', deployments: 3, target: 5 },
  { date: 'Tue', deployments: 5, target: 5 },
  { date: 'Wed', deployments: 4, target: 5 },
  { date: 'Thu', deployments: 6, target: 5 },
  { date: 'Fri', deployments: 4, target: 5 },
  { date: 'Sat', deployments: 2, target: 5 },
  { date: 'Sun', deployments: 1, target: 5 },
];

// Lead time breakdown data
export const leadTimeBreakdownData = [
  { stage: 'Coding', time: 18, percentage: 45 },
  { stage: 'Review', time: 12, percentage: 30 },
  { stage: 'Testing', time: 6, percentage: 15 },
  { stage: 'Deploy', time: 4, percentage: 10 },
];

// PR Analytics Data
export const prAnalyticsData = {
  totalPRs: 156,
  openPRs: 23,
  mergedThisWeek: 42,
  avgCycleTime: 18.5, // hours
  avgReviewTime: 6.2, // hours
};

export const cycleTimeData = [
  { week: 'W1', coding: 12, review: 8, merge: 4 },
  { week: 'W2', coding: 10, review: 6, merge: 3 },
  { week: 'W3', coding: 14, review: 9, merge: 5 },
  { week: 'W4', coding: 11, review: 7, merge: 4 },
  { week: 'W5', coding: 9, review: 5, merge: 3 },
  { week: 'W6', coding: 8, review: 5, merge: 2 },
];

export const prSizeDistribution = [
  { size: 'XS (<10)', count: 45, avgTime: 2 },
  { size: 'S (10-50)', count: 62, avgTime: 8 },
  { size: 'M (50-200)', count: 34, avgTime: 18 },
  { size: 'L (200-500)', count: 12, avgTime: 32 },
  { size: 'XL (500+)', count: 3, avgTime: 72 },
];

export const activePRs: PRData[] = [
  {
    id: 'PR-1234',
    title: 'feat: Add DORA metrics dashboard',
    author: 'Sarah Chen',
    authorAvatar: 'SC',
    status: 'open',
    createdAt: '2026-02-05T10:30:00Z',
    reviewers: ['Marcus Johnson', 'Alex Rivera'],
    linesAdded: 456,
    linesRemoved: 23,
    cycleTime: { coding: 8, review: 4, merge: 0, total: 12 },
    labels: ['feature', 'frontend'],
    repository: 'polaris-frontend',
  },
  {
    id: 'PR-1235',
    title: 'fix: Resolve authentication timeout issue',
    author: 'Marcus Johnson',
    authorAvatar: 'MJ',
    status: 'open',
    createdAt: '2026-02-06T14:20:00Z',
    reviewers: ['Sarah Chen'],
    linesAdded: 45,
    linesRemoved: 12,
    cycleTime: { coding: 3, review: 2, merge: 0, total: 5 },
    labels: ['bug', 'backend'],
    repository: 'polaris-api',
  },
  {
    id: 'PR-1233',
    title: 'refactor: Optimize database queries',
    author: 'Alex Rivera',
    authorAvatar: 'AR',
    status: 'merged',
    createdAt: '2026-02-04T09:00:00Z',
    mergedAt: '2026-02-06T11:30:00Z',
    reviewers: ['Marcus Johnson', 'Dr. Aisha Patel'],
    linesAdded: 234,
    linesRemoved: 189,
    cycleTime: { coding: 12, review: 8, merge: 2, total: 22 },
    labels: ['refactor', 'performance'],
    repository: 'polaris-api',
  },
];

// Developer Stats
export const developerStats: DeveloperStats[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'SC',
    team: 'Frontend',
    commits: 87,
    prsOpened: 23,
    prsMerged: 21,
    reviewsGiven: 45,
    avgReviewTime: 2.5,
    linesOfCode: 4520,
    impactScore: 94,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    team: 'Backend',
    commits: 65,
    prsOpened: 18,
    prsMerged: 17,
    reviewsGiven: 38,
    avgReviewTime: 3.2,
    linesOfCode: 3890,
    impactScore: 88,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    avatar: 'AR',
    team: 'DevOps',
    commits: 54,
    prsOpened: 15,
    prsMerged: 14,
    reviewsGiven: 52,
    avgReviewTime: 1.8,
    linesOfCode: 2340,
    impactScore: 91,
  },
  {
    id: '4',
    name: 'Dr. Aisha Patel',
    avatar: 'AP',
    team: 'ML/AI',
    commits: 42,
    prsOpened: 12,
    prsMerged: 11,
    reviewsGiven: 28,
    avgReviewTime: 4.5,
    linesOfCode: 5670,
    impactScore: 85,
  },
];

// Bottleneck Data
export const bottleneckData: BottleneckData[] = [
  { stage: 'Waiting for Review', avgTime: 8.5, prsStuck: 12, severity: 'critical' },
  { stage: 'In Review', avgTime: 4.2, prsStuck: 5, severity: 'warning' },
  { stage: 'Waiting for CI', avgTime: 1.5, prsStuck: 3, severity: 'normal' },
  { stage: 'Waiting for Deploy', avgTime: 2.0, prsStuck: 2, severity: 'normal' },
];

export const stalePRs = [
  { id: 'PR-1198', title: 'Legacy API migration', age: 14, author: 'Alex Rivera', status: 'blocked' },
  { id: 'PR-1205', title: 'Update dependencies', age: 10, author: 'Marcus Johnson', status: 'needs-review' },
  { id: 'PR-1212', title: 'Add unit tests for auth', age: 7, author: 'Sarah Chen', status: 'changes-requested' },
];

// Workflow Rules
export const workflowRules: WorkflowRule[] = [
  {
    id: '1',
    name: 'Auto-merge Documentation',
    description: 'Automatically merge PRs that only modify documentation files',
    trigger: 'PR opened',
    conditions: ['files match docs/**', 'lines changed < 50', 'CI passed'],
    actions: ['add label: docs', 'auto-approve', 'auto-merge'],
    enabled: true,
    executions: 45,
    lastTriggered: '2 hours ago',
  },
  {
    id: '2',
    name: 'Assign Frontend Reviewers',
    description: 'Auto-assign frontend team leads to React component PRs',
    trigger: 'PR opened',
    conditions: ['files match src/components/**', 'author not in frontend-leads'],
    actions: ['assign reviewer: Sarah Chen', 'add label: frontend'],
    enabled: true,
    executions: 78,
    lastTriggered: '30 minutes ago',
  },
  {
    id: '3',
    name: 'Large PR Warning',
    description: 'Add warning label and comment on PRs with more than 500 lines',
    trigger: 'PR opened',
    conditions: ['lines changed > 500'],
    actions: ['add label: needs-split', 'add comment: Consider splitting this PR'],
    enabled: true,
    executions: 12,
    lastTriggered: '1 day ago',
  },
  {
    id: '4',
    name: 'Security Review Required',
    description: 'Require security team review for auth-related changes',
    trigger: 'PR opened',
    conditions: ['files match **/auth/**', 'files match **/security/**'],
    actions: ['assign reviewer: security-team', 'add label: security-review', 'block merge'],
    enabled: true,
    executions: 8,
    lastTriggered: '3 days ago',
  },
];

// Alerts
export const alerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'High Change Failure Rate',
    description: 'Change failure rate exceeded 5% threshold in the last 24 hours',
    timestamp: '2026-02-07T14:30:00Z',
    acknowledged: false,
    metric: 'Change Failure Rate',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Long PR Review Time',
    description: 'Average PR review time has increased to 8.5 hours',
    timestamp: '2026-02-07T12:00:00Z',
    acknowledged: false,
    metric: 'Review Time',
  },
  {
    id: '3',
    type: 'info',
    title: 'Deployment Target Met',
    description: 'Daily deployment frequency target achieved for 5 consecutive days',
    timestamp: '2026-02-07T09:00:00Z',
    acknowledged: true,
    metric: 'Deployment Frequency',
  },
];

// DORA Rating thresholds
export const doraRatingThresholds = {
  deploymentFrequency: {
    elite: { min: 1, label: 'Multiple per day' },
    high: { min: 1 / 7, label: 'Weekly to daily' },
    medium: { min: 1 / 30, label: 'Monthly to weekly' },
    low: { min: 0, label: 'Less than monthly' },
  },
  leadTime: {
    elite: { max: 1, label: 'Less than 1 day' },
    high: { max: 7, label: '1 day to 1 week' },
    medium: { max: 30, label: '1 week to 1 month' },
    low: { max: Infinity, label: 'More than 1 month' },
  },
  mttr: {
    elite: { max: 60, label: 'Less than 1 hour' },
    high: { max: 1440, label: 'Less than 1 day' },
    medium: { max: 10080, label: 'Less than 1 week' },
    low: { max: Infinity, label: 'More than 1 week' },
  },
  changeFailureRate: {
    elite: { max: 5, label: '0-5%' },
    high: { max: 10, label: '5-10%' },
    medium: { max: 15, label: '10-15%' },
    low: { max: 100, label: '15%+' },
  },
};

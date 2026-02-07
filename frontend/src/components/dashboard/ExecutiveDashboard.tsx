import { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, AlertTriangle, Loader2, RefreshCw, FileQuestion,
    GitPullRequest, GitCommit, Users, Bug, CheckCircle, Circle, Clock,
    Zap, Target, Activity, AlertCircle, ArrowUpRight, ArrowDownRight,
    Brain, Lightbulb, Shield, Info, FileText
} from 'lucide-react';
import { getCommits, getPullRequests, getContributors, getJiraIssues, getGitHubIssues } from '@/api/github';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface SelectedRepo {
    name: string;
    fullName: string;
    description?: string;
}

interface ExecutiveDashboardProps {
    selectedRepo?: SelectedRepo | null;
}

// Health Score Gauge Component
const HealthScoreGauge = ({ score, label }: { score: number; label: string }) => {
    const getColor = (s: number) => {
        if (s >= 80) return '#10b981';
        if (s >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="45" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                    <circle
                        cx="64" cy="64" r="45"
                        stroke={getColor(score)}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{score}</span>
                </div>
            </div>
            <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
        </div>
    );
};

// Sparkline Component
const Sparkline = ({ data, color, trend }: { data: number[]; color: string; trend: 'up' | 'down' | 'stable' }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 60;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="flex items-center gap-2">
            <svg width={width} height={height} className="overflow-visible">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {trend === 'up' && <ArrowUpRight className="size-4 text-emerald-500" />}
            {trend === 'down' && <ArrowDownRight className="size-4 text-red-500" />}
        </div>
    );
};

// KPI Card with Sparkline
const KPICard = ({
    icon: Icon,
    label,
    value,
    subtext,
    color,
    sparklineData,
    trend
}: {
    icon: any;
    label: string;
    value: string | number;
    subtext: string;
    color: string;
    sparklineData?: number[];
    trend?: 'up' | 'down' | 'stable';
}) => (
    <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Icon className={`size-5 ${color}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {sparklineData && trend && (
                <Sparkline data={sparklineData} color={color.includes('blue') ? '#3b82f6' : color.includes('purple') ? '#8b5cf6' : '#10b981'} trend={trend} />
            )}
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
    </div>
);

// Detailed AI Insight Interface
interface DetailedInsight {
    title: string;
    icon: string;
    severity: 'critical' | 'warning' | 'info' | 'success';
    explanation: string;
    solution: string;
    impactBefore: string;
    impactAfter: string;
    metric?: string;
}

// AI Insights Panel with Detailed Cards
const AIInsightsPanel = ({ insights }: { insights: DetailedInsight[] }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const severityColors = {
        critical: 'border-red-200 bg-red-50',
        warning: 'border-amber-200 bg-amber-50',
        info: 'border-blue-200 bg-blue-50',
        success: 'border-emerald-200 bg-emerald-50'
    };

    const severityIcons = {
        critical: '🚨',
        warning: '⚠️',
        info: '💡',
        success: '✅'
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="size-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">AI-Powered Insights</h3>
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {insights.length} insights detected
                </span>
            </div>
            <div className="space-y-4">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${severityColors[insight.severity]}`}
                    >
                        {/* Header - Always Visible */}
                        <div
                            className="p-4 cursor-pointer flex items-start gap-3"
                            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        >
                            <span className="text-xl">{insight.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{severityIcons[insight.severity]}</span>
                                    <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                                    {insight.metric && (
                                        <span className="ml-auto text-sm font-mono bg-white/50 px-2 py-0.5 rounded">
                                            {insight.metric}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{insight.explanation}</p>
                            </div>
                            <div className={`transition-transform duration-300 ${expandedIndex === i ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedIndex === i && (
                            <div className="px-4 pb-4 space-y-4 border-t border-white/50 pt-4">
                                {/* Solution */}
                                <div className="bg-white/70 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="size-4 text-blue-600" />
                                        <h5 className="font-semibold text-slate-800">Recommended Solution</h5>
                                    </div>
                                    <p className="text-sm text-slate-700">{insight.solution}</p>
                                </div>

                                {/* Impact Comparison */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-red-100/50 rounded-lg p-4 border border-red-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ArrowDownRight className="size-4 text-red-600" />
                                            <h5 className="font-semibold text-red-800 text-sm">If Not Addressed</h5>
                                        </div>
                                        <p className="text-sm text-red-700">{insight.impactBefore}</p>
                                    </div>
                                    <div className="bg-emerald-100/50 rounded-lg p-4 border border-emerald-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ArrowUpRight className="size-4 text-emerald-600" />
                                            <h5 className="font-semibold text-emerald-800 text-sm">After Resolution</h5>
                                        </div>
                                        <p className="text-sm text-emerald-700">{insight.impactAfter}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Detailed Risk interface
interface DetailedRisk {
    type: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
    icon: string;
    explanation: string;
    solution: string;
    impactBefore: string;
    impactAfter: string;
    affectedItems?: string[];
}

// Enhanced Risk Alerts Panel with detailed expandable cards
const RiskAlertsPanel = ({ risks }: { risks: DetailedRisk[] }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const severityConfig = {
        high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800', icon: '🚨' },
        medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', icon: '⚠️' },
        low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', icon: '💡' }
    };

    if (risks.length === 0) return null;

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="size-5 text-red-500" />
                <h3 className="font-semibold text-slate-900">Risk Alerts</h3>
                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    {risks.length} {risks.length === 1 ? 'alert' : 'alerts'}
                </span>
            </div>
            <div className="space-y-3">
                {risks.map((risk, i) => {
                    const config = severityConfig[risk.severity];
                    return (
                        <div
                            key={i}
                            className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${config.bg} ${config.border}`}
                        >
                            {/* Header - Always Visible */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">{risk.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.badge}`}>
                                                {risk.severity.toUpperCase()}
                                            </span>
                                            <h4 className={`font-semibold ${config.text}`}>{risk.type}</h4>
                                        </div>
                                        <p className={`text-sm mt-1 ${config.text}`}>{risk.message}</p>
                                    </div>
                                    <div className={`transition-transform duration-300 ${expandedIndex === i ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedIndex === i && (
                                <div className="px-4 pb-4 space-y-4 border-t border-white/50 pt-4">
                                    {/* Explanation */}
                                    <div className="bg-white/70 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Info className="size-4 text-slate-600" />
                                            <h5 className="font-semibold text-slate-800">Why This Matters</h5>
                                        </div>
                                        <p className="text-sm text-slate-700">{risk.explanation}</p>
                                    </div>

                                    {/* Affected Items */}
                                    {risk.affectedItems && risk.affectedItems.length > 0 && (
                                        <div className="bg-white/70 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="size-4 text-slate-600" />
                                                <h5 className="font-semibold text-slate-800">Affected Items ({risk.affectedItems.length})</h5>
                                            </div>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {risk.affectedItems.slice(0, 5).map((item, idx) => (
                                                    <div key={idx} className="text-sm text-slate-600 bg-slate-100 rounded px-2 py-1">
                                                        {item}
                                                    </div>
                                                ))}
                                                {risk.affectedItems.length > 5 && (
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        +{risk.affectedItems.length - 5} more items
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Solution */}
                                    <div className="bg-white/70 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="size-4 text-blue-600" />
                                            <h5 className="font-semibold text-slate-800">Recommended Actions</h5>
                                        </div>
                                        <p className="text-sm text-slate-700 whitespace-pre-line">{risk.solution}</p>
                                    </div>

                                    {/* Impact Comparison */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-100/50 rounded-lg p-4 border border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ArrowDownRight className="size-4 text-red-600" />
                                                <h5 className="font-semibold text-red-800 text-sm">If Ignored</h5>
                                            </div>
                                            <p className="text-sm text-red-700">{risk.impactBefore}</p>
                                        </div>
                                        <div className="bg-emerald-100/50 rounded-lg p-4 border border-emerald-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ArrowUpRight className="size-4 text-emerald-600" />
                                                <h5 className="font-semibold text-emerald-800 text-sm">After Resolution</h5>
                                            </div>
                                            <p className="text-sm text-emerald-700">{risk.impactAfter}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export function ExecutiveDashboard({ selectedRepo }: ExecutiveDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [commits, setCommits] = useState<any[]>([]);
    const [prs, setPrs] = useState<any[]>([]);
    const [contributors, setContributors] = useState<any[]>([]);
    const [jiraIssues, setJiraIssues] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [aiInsights, setAiInsights] = useState<DetailedInsight[]>([]);

    const fetchData = async () => {
        if (!selectedRepo) return;

        setLoading(true);
        setError(null);

        try {
            const [commitsData, prsData, contribData, jiraData] = await Promise.all([
                getCommits(selectedRepo.name),
                getPullRequests(selectedRepo.name),
                getContributors(selectedRepo.name),
                getJiraIssues()
            ]);

            setCommits(commitsData);
            setPrs(prsData);
            setContributors(contribData);
            setJiraIssues(jiraData);

            // Generate AI insights based on data
            generateAIInsights(commitsData, prsData, jiraData, contribData);

        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const generateAIInsights = (commits: any[], prs: any[], issues: any[], contribs: any[]) => {
        const insights: DetailedInsight[] = [];

        // Analyze PR patterns - Open PRs
        const openPRs = prs.filter(p => p.state === 'open');
        if (openPRs.length > 3) {
            insights.push({
                title: 'PR Review Bottleneck Detected',
                icon: '🔀',
                severity: openPRs.length > 10 ? 'critical' : 'warning',
                metric: `${openPRs.length} open PRs`,
                explanation: `You have ${openPRs.length} pull requests waiting for review. When PRs pile up, it creates merge conflicts, blocks dependent work, and reduces team velocity. The longer PRs sit, the harder they are to review.`,
                solution: '1. Schedule dedicated PR review time daily (30 min recommended)\n2. Assign reviewers immediately when PRs are created\n3. Set a 24-48 hour review SLA\n4. Consider pairing for complex PRs to speed up reviews',
                impactBefore: `Release delays due to blocked PRs. Developers context-switch waiting for reviews. Merge conflicts increase by ~15% per waiting day. Team morale decreases.`,
                impactAfter: `Faster release cycles (up to 40% improvement). Reduced merge conflicts. Better code quality through timely reviews. Improved team flow and collaboration.`
            });
        }

        // Analyze commit frequency
        const recentCommits = commits.filter(c => {
            const date = new Date(c.commit?.author?.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date > weekAgo;
        });

        if (recentCommits.length < 5) {
            insights.push({
                title: 'Low Development Activity',
                icon: '📉',
                severity: 'warning',
                metric: `${recentCommits.length} commits/week`,
                explanation: `Only ${recentCommits.length} commits were made in the past week, which is below typical team velocity. This could indicate blockers, unclear requirements, resource constraints, or scope creep affecting progress.`,
                solution: '1. Hold a team sync to identify blockers\n2. Review sprint backlog for unclear tickets\n3. Check if developers are waiting on dependencies\n4. Consider if the team is overallocated to meetings\n5. Assess if technical debt is slowing progress',
                impactBefore: `Sprint goals at risk. Deadlines may slip. Technical debt compounds if development stalls. Team may be silently blocked.`,
                impactAfter: `Clear visibility into blockers. Faster resolution of impediments. Team velocity returns to normal. Sprint commitments met.`
            });
        } else if (recentCommits.length > 30) {
            insights.push({
                title: 'High Development Velocity',
                icon: '🚀',
                severity: 'success',
                metric: `${recentCommits.length} commits/week`,
                explanation: `Excellent! ${recentCommits.length} commits this week indicates strong team momentum. High commit frequency typically correlates with healthy development practices and engaged team members.`,
                solution: '1. Maintain current practices\n2. Document what\'s working well\n3. Monitor for burnout signs\n4. Ensure quality isn\'t sacrificed for speed\n5. Consider sharing practices with other teams',
                impactBefore: `N/A - This is a positive indicator`,
                impactAfter: `Sustained velocity. On-time deliveries. Team confidence high. Stakeholder satisfaction improved.`
            });
        }

        // Analyze bugs
        const bugs = issues.filter(i => i.type?.toLowerCase() === 'bug');
        const openBugs = bugs.filter(i => i.status?.toLowerCase() !== 'done');
        if (openBugs.length > 3) {
            insights.push({
                title: 'Bug Backlog Requires Attention',
                icon: '🐛',
                severity: openBugs.length > 10 ? 'critical' : 'warning',
                metric: `${openBugs.length} open bugs`,
                explanation: `${openBugs.length} unresolved bugs are accumulating in the backlog. Growing bug counts indicate either quality issues in development, insufficient testing, or deprioritization of bug fixes in favor of new features.`,
                solution: '1. Triage bugs by severity and user impact\n2. Allocate 20% of sprint capacity to bug fixes\n3. Implement a "Bug Fix Friday" practice\n4. Add unit tests for each bug fix to prevent regression\n5. Review recent changes that may have introduced bugs',
                impactBefore: `User experience degrades. Technical debt grows. Customer complaints increase by ~25% per unresolved critical bug. Developer time spent on workarounds.`,
                impactAfter: `Improved product stability. Better user satisfaction. Reduced support tickets. Cleaner codebase with fewer workarounds.`
            });
        }

        // Analyze stale PRs
        const stalePRs = prs.filter(p => {
            const updated = new Date(p.updated_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return p.state === 'open' && updated < weekAgo;
        });
        if (stalePRs.length > 0) {
            insights.push({
                title: 'Stale PRs Need Resolution',
                icon: '⏰',
                severity: 'warning',
                metric: `${stalePRs.length} stale PRs`,
                explanation: `${stalePRs.length} PRs haven't been updated in over 7 days. Stale PRs often become obsolete, have merge conflicts, or represent abandoned work. They clutter the backlog and create uncertainty.`,
                solution: '1. Review each stale PR with its author\n2. Decide: merge, close, or update\n3. For abandoned PRs, archive or close with notes\n4. Set up automated reminders for PR authors\n5. Add "stale" labels to track these PRs',
                impactBefore: `Code rot and merge conflicts. Wasted development effort. Unclear project status. Technical debt from outdated approaches.`,
                impactAfter: `Clean PR queue. Clear project visibility. Reduced merge conflicts. Better developer experience.`
            });
        }

        // Contributor concentration risk
        if (contribs.length > 0 && contribs[0]?.contributions > 0) {
            const topContributor = contribs[0];
            const totalContributions = contribs.reduce((sum: number, c: any) => sum + (c.contributions || 0), 0);
            const topContributorPercent = Math.round((topContributor.contributions / totalContributions) * 100);

            if (topContributorPercent > 50 && contribs.length > 1) {
                insights.push({
                    title: 'Knowledge Concentration Risk',
                    icon: '👤',
                    severity: 'info',
                    metric: `${topContributorPercent}% by 1 person`,
                    explanation: `${topContributor.login} accounts for ${topContributorPercent}% of contributions. While having a strong contributor is valuable, over-reliance on one person creates a "bus factor" risk - if they're unavailable, project velocity could halt.`,
                    solution: '1. Pair programming sessions to transfer knowledge\n2. Rotate code review assignments\n3. Document critical system areas\n4. Shadow sessions for complex features\n5. Cross-training on key components',
                    impactBefore: `Knowledge silos. Single point of failure. Bottleneck for reviews/approvals. Risk if person leaves or is sick.`,
                    impactAfter: `Distributed expertise. Resilient team. Better bus factor score. Multiple people can handle critical work.`
                });
            }
        }

        // Add positive insight if everything looks good
        if (insights.length === 0) {
            insights.push({
                title: 'Project Health Excellent',
                icon: '✅',
                severity: 'success',
                explanation: 'All monitored metrics are within healthy ranges. Your team is maintaining good development practices with balanced PR reviews, steady commits, and manageable bug counts.',
                solution: '1. Continue current practices\n2. Document what\'s working\n3. Share best practices with other teams\n4. Consider raising the bar on metrics\n5. Focus on continuous improvement',
                impactBefore: 'N/A - No issues detected',
                impactAfter: 'Sustained excellence. Team confidence. Stakeholder trust. Foundation for growth.'
            });
        }

        setAiInsights(insights);
    };

    useEffect(() => {
        if (selectedRepo) {
            fetchData();
        }
    }, [selectedRepo]);

    // Calculate metrics
    const calculateHealthScore = () => {
        let score = 70; // Base score

        // PR factor
        const openPRs = prs.filter(p => p.state === 'open').length;
        if (openPRs <= 3) score += 10;
        else if (openPRs > 10) score -= 15;

        // Bug factor
        const openBugs = jiraIssues.filter(i =>
            i.type?.toLowerCase() === 'bug' && i.status?.toLowerCase() !== 'done'
        ).length;
        if (openBugs === 0) score += 10;
        else if (openBugs > 5) score -= 10;

        // Activity factor
        if (commits.length > 10) score += 10;

        return Math.min(100, Math.max(0, score));
    };

    const jiraMetrics = {
        total: jiraIssues.length,
        bugs: jiraIssues.filter(i => i.type?.toLowerCase() === 'bug').length,
        done: jiraIssues.filter(i => i.status?.toLowerCase() === 'done').length,
        inProgress: jiraIssues.filter(i => i.status?.toLowerCase() === 'in progress').length,
        todo: jiraIssues.filter(i => ['to do', 'open'].includes(i.status?.toLowerCase())).length,
    };

    // Generate chart data from real commits and PRs
    const getWeeklyData = () => {
        const now = new Date();
        const weeks = [];

        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (i + 1) * 7);
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() - i * 7);

            const weekCommits = commits.filter(c => {
                const date = new Date(c.commit?.author?.date || c.created_at);
                return date >= weekStart && date < weekEnd;
            }).length;

            const weekPRs = prs.filter(p => {
                const date = new Date(p.created_at);
                return date >= weekStart && date < weekEnd;
            }).length;

            weeks.push({
                name: `Week ${4 - i}`,
                commits: weekCommits,
                prs: weekPRs
            });
        }
        return weeks;
    };

    const velocityData = getWeeklyData();

    const issueDistribution = [
        { name: 'Done', value: jiraMetrics.done, color: '#10b981' },
        { name: 'In Progress', value: jiraMetrics.inProgress, color: '#3b82f6' },
        { name: 'To Do', value: jiraMetrics.todo, color: '#94a3b8' },
        { name: 'Bugs', value: jiraMetrics.bugs, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Identify detailed risks
    const risks: DetailedRisk[] = [];

    // Stale PRs Risk
    const stalePRs = prs.filter(p => {
        const updated = new Date(p.updated_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return p.state === 'open' && updated < weekAgo;
    });
    if (stalePRs.length > 0) {
        risks.push({
            type: 'Stale Pull Requests',
            message: `${stalePRs.length} PRs haven't been updated in 7+ days`,
            severity: stalePRs.length > 5 ? 'high' : 'medium',
            icon: '⏰',
            explanation: `These pull requests have been sitting idle for over a week. Stale PRs often indicate abandoned work, disagreements about approach, blocked dependencies, or simply forgotten reviews. The longer they remain open, the higher the chance of merge conflicts and code rot.`,
            solution: `1. Review each stale PR and contact the author\n2. If the PR is blocked, document the blocker and assign someone to unblock\n3. If the PR is abandoned, either close it or assign a new owner\n4. Set up automated PR reminders (e.g., GitHub Actions, Slack bot)\n5. Consider adding a "stale" label for visibility`,
            impactBefore: `Merge conflicts when finally merged. Wasted development effort. Context lost as developers move on. Technical debt from outdated approaches being merged.`,
            impactAfter: `Clean PR queue. Clear project status. Faster merge times. Better developer experience and morale.`,
            affectedItems: stalePRs.slice(0, 10).map(p => `#${p.number}: ${p.title}`)
        });
    }

    // Bug Backlog Risk
    const openBugs = jiraIssues.filter(i => i.type?.toLowerCase() === 'bug' && i.status?.toLowerCase() !== 'done');
    if (openBugs.length > 5) {
        risks.push({
            type: 'Bug Backlog Growing',
            message: `${openBugs.length} unresolved bugs impacting product quality`,
            severity: openBugs.length > 15 ? 'high' : 'medium',
            icon: '🐛',
            explanation: `A large bug backlog indicates quality issues in the development process. Each unresolved bug represents a potential user complaint, a workaround developers must code around, and technical debt accumulating. Bugs compound - one bug can mask or cause others.`,
            solution: `1. Triage bugs by severity and user impact\n2. Reserve 20% of each sprint for bug fixes\n3. Implement "Bug Fix Friday" or dedicated bug sprints\n4. Add unit tests for each bug fix to prevent regression\n5. Root cause analysis: are bugs from specific areas? Fix the source`,
            impactBefore: `User dissatisfaction increases. Support costs rise. Developers work around bugs rather than fix them. New features built on buggy foundations. ~25% more support tickets per 10 open bugs.`,
            impactAfter: `Improved user satisfaction scores. Lower support volume. Cleaner codebase. Faster feature development on stable foundation.`,
            affectedItems: openBugs.slice(0, 10).map(b => `${b.key || b.id}: ${b.summary || b.title}`)
        });
    }

    // Open PRs Bottleneck
    const openPRs = prs.filter(p => p.state === 'open');
    if (openPRs.length > 8) {
        risks.push({
            type: 'PR Review Bottleneck',
            message: `${openPRs.length} PRs waiting for review causing delivery delays`,
            severity: openPRs.length > 15 ? 'high' : 'medium',
            icon: '🔀',
            explanation: `Too many open PRs indicate a review bottleneck. When developers wait for reviews, they context-switch to new work, making it harder to address feedback later. This creates a cycle of growing PR queues and slower delivery.`,
            solution: `1. Set a team SLA for PR reviews (24-48 hours)\n2. Schedule daily 30-min review blocks\n3. Assign reviewers at PR creation time\n4. Use PR size limits (< 400 lines ideal)\n5. Enable auto-assignment for balanced distribution`,
            impactBefore: `Developers blocked waiting for reviews. Context switching reduces productivity by 20-40%. Merge conflicts increase. Release timelines slip.`,
            impactAfter: `Faster PR cycle time. Reduced WIP (work in progress). Smoother releases. Better team flow and collaboration.`,
            affectedItems: openPRs.slice(0, 10).map(p => `#${p.number}: ${p.title}`)
        });
    }

    // Low Commit Activity
    const recentCommits = commits.filter(c => {
        const date = new Date(c.commit?.author?.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date > weekAgo;
    });
    if (recentCommits.length < 3 && commits.length > 0) {
        risks.push({
            type: 'Development Activity Slowdown',
            message: `Only ${recentCommits.length} commits in the last week - below normal velocity`,
            severity: recentCommits.length === 0 ? 'high' : 'medium',
            icon: '📉',
            explanation: `Low commit activity could signal blocked developers, unclear requirements, team capacity issues, or a shift in priorities. Without commits, the project isn't progressing toward goals.`,
            solution: `1. Hold a team sync to identify blockers\n2. Check if developers are waiting on dependencies\n3. Review if requirements are clear enough\n4. Assess if team is overloaded with meetings\n5. Consider if technical debt is slowing progress`,
            impactBefore: `Sprint goals at risk. Deadlines may slip. Stakeholders lose confidence. Technical problems may be hiding.`,
            impactAfter: `Clear understanding of progress blockers. Faster resolution. Team velocity recovers. Sprint commitments met.`
        });
    }

    // No repo selected state
    if (!selectedRepo) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <FileQuestion className="size-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a Repository</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                    Choose a repository from the dropdown above to view insights.
                </p>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <Loader2 className="size-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading Analytics...</h3>
                <p className="text-slate-600">Fetching data from GitHub & Jira</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <AlertTriangle className="size-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Data</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button onClick={fetchData} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <RefreshCw className="size-4" /> Retry
                </button>
            </div>
        );
    }

    const healthScore = calculateHealthScore();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Executive Dashboard</h2>
                    <p className="text-slate-600 mt-1">Real-time insights for {selectedRepo.name}</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <RefreshCw className="size-4" /> Refresh
                </button>
            </div>

            {/* Health Scores Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-center">
                    <HealthScoreGauge score={healthScore} label="Overall Health" />
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-center">
                    <HealthScoreGauge
                        score={jiraMetrics.total > 0 ? Math.round((jiraMetrics.done / jiraMetrics.total) * 100) : 0}
                        label="Completion Rate"
                    />
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-center">
                    <HealthScoreGauge
                        score={prs.length > 0 ? Math.round((prs.filter(p => p.merged_at).length / prs.length) * 100) : 0}
                        label="PR Merge Rate"
                    />
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-center">
                    <HealthScoreGauge
                        score={Math.min(100, contributors.length * 10)}
                        label="Team Activity"
                    />
                </div>
            </div>

            {/* KPI Cards with Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    icon={GitCommit}
                    label="Total Commits"
                    value={commits.length}
                    subtext="Recent activity"
                    color="text-blue-600"
                    sparklineData={[12, 19, 15, 22, 18, commits.length]}
                    trend="up"
                />
                <KPICard
                    icon={GitPullRequest}
                    label="Pull Requests"
                    value={prs.length}
                    subtext={`${prs.filter(p => p.state === 'open').length} open`}
                    color="text-purple-600"
                    sparklineData={[3, 5, 4, 6, 5, prs.length]}
                    trend="up"
                />
                <KPICard
                    icon={Users}
                    label="Contributors"
                    value={contributors.length}
                    subtext="Active team members"
                    color="text-emerald-600"
                    sparklineData={[2, 3, 3, 4, 4, contributors.length]}
                    trend="stable"
                />
                <KPICard
                    icon={Bug}
                    label="Open Bugs"
                    value={jiraMetrics.bugs}
                    subtext="Needs attention"
                    color="text-red-600"
                    sparklineData={[5, 4, 6, 3, 4, jiraMetrics.bugs]}
                    trend={jiraMetrics.bugs > 5 ? 'down' : 'up'}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Velocity Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity className="size-5 text-blue-600" />
                        Velocity Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={velocityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            />
                            <Area type="monotone" dataKey="commits" stroke="#3b82f6" fill="#93c5fd" name="Commits" />
                            <Area type="monotone" dataKey="prs" stroke="#8b5cf6" fill="#c4b5fd" name="PRs" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Issue Distribution */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Target className="size-5 text-indigo-600" />
                        Issue Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={issueDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {issueDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insights Panel */}
            {aiInsights.length > 0 && <AIInsightsPanel insights={aiInsights} />}

            {/* Risk Alerts Panel */}
            <RiskAlertsPanel risks={risks} />

            {/* To Do Tasks Section */}
            {jiraIssues.filter(i => ['to do', 'open'].includes(i.status?.toLowerCase())).length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="size-5 text-blue-600" />
                            To Do Tasks
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {jiraIssues.filter(i => ['to do', 'open'].includes(i.status?.toLowerCase())).length} items
                            </span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {jiraIssues
                            .filter(i => ['to do', 'open'].includes(i.status?.toLowerCase()))
                            .slice(0, 9)
                            .map((issue: any, idx: number) => (
                                <div
                                    key={issue.key || idx}
                                    className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${issue.priority?.toLowerCase() === 'high' || issue.priority?.toLowerCase() === 'highest'
                                            ? 'bg-red-500'
                                            : issue.priority?.toLowerCase() === 'medium'
                                                ? 'bg-amber-500'
                                                : 'bg-blue-500'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                    {issue.key || `TASK-${idx + 1}`}
                                                </span>
                                                {issue.type?.toLowerCase() === 'bug' && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                                        🐛 Bug
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-medium text-slate-900 text-sm line-clamp-2">
                                                {issue.summary || issue.title || 'Untitled Task'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                                {issue.assignee && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="size-3" />
                                                        {issue.assignee}
                                                    </span>
                                                )}
                                                {issue.priority && (
                                                    <span className={`px-1.5 py-0.5 rounded ${issue.priority?.toLowerCase() === 'high' || issue.priority?.toLowerCase() === 'highest'
                                                        ? 'bg-red-100 text-red-700'
                                                        : issue.priority?.toLowerCase() === 'medium'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {issue.priority}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {jiraIssues.filter(i => ['to do', 'open'].includes(i.status?.toLowerCase())).length > 9 && (
                        <div className="mt-4 text-center">
                            <span className="text-sm text-slate-500">
                                +{jiraIssues.filter(i => ['to do', 'open'].includes(i.status?.toLowerCase())).length - 9} more tasks in Jira
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Recent Commits */}
                {commits.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <GitCommit className="size-5 text-blue-600" />
                            Recent Commits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {commits.slice(0, 6).map((commit: any) => (
                                <div key={commit.sha} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <p className="font-medium text-slate-900 truncate">{commit.commit?.message?.split('\n')[0]}</p>
                                    <p className="text-sm text-slate-500">{commit.commit?.author?.name} • {new Date(commit.commit?.author?.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent PRs */}
                {prs.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <GitPullRequest className="size-5 text-purple-600" />
                            Pull Requests
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {prs.slice(0, 6).map((pr: any) => (
                                <div key={pr.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{pr.title}</p>
                                        <p className="text-sm text-slate-500">#{pr.number} by {pr.user?.login}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ml-3 ${pr.state === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {pr.state}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Top Contributors */}
            {contributors.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Users className="size-5 text-emerald-600" />
                        Top Contributors
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {contributors.slice(0, 10).map((c: any) => (
                            <div key={c.id} className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg">
                                <img src={c.avatar_url} alt={c.login} className="size-10 rounded-full" />
                                <div>
                                    <p className="font-medium text-slate-900">{c.login}</p>
                                    <p className="text-xs text-slate-500">{c.contributions} commits</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

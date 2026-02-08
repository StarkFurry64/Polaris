import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, GitPullRequest, AlertCircle, ArrowRight, Timer, TrendingUp, Calendar, Download, Zap } from 'lucide-react';
import { bottleneckData, stalePRs } from '@/lib/doraMetricsData';

const pipelineFlowData = [
    { stage: 'Backlog', prs: 45, avgTime: 0 },
    { stage: 'In Progress', prs: 18, avgTime: 12 },
    { stage: 'Code Review', prs: 12, avgTime: 8.5 },
    { stage: 'QA Testing', prs: 5, avgTime: 4 },
    { stage: 'Ready to Deploy', prs: 3, avgTime: 2 },
    { stage: 'Deployed', prs: 156, avgTime: 0 },
];

const queueTimeData = [
    { day: 'Mon', waiting: 4.2, inReview: 6.5 },
    { day: 'Tue', waiting: 3.8, inReview: 5.2 },
    { day: 'Wed', waiting: 5.5, inReview: 7.8 },
    { day: 'Thu', waiting: 4.0, inReview: 5.5 },
    { day: 'Fri', waiting: 6.2, inReview: 8.2 },
];

function getSeverityColor(severity: string) {
    switch (severity) {
        case 'critical': return 'bg-rose-500';
        case 'warning': return 'bg-amber-500';
        case 'normal': return 'bg-emerald-500';
        default: return 'bg-secondary0';
    }
}

function getSeverityBg(severity: string) {
    switch (severity) {
        case 'critical': return 'bg-rose-50 border-rose-200';
        case 'warning': return 'bg-amber-50 border-amber-500/30';
        case 'normal': return 'bg-emerald-50 border-emerald-500/30';
        default: return 'bg-secondary border-border';
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'blocked': return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'needs-review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'changes-requested': return 'bg-primary/20 text-primary border-blue-200';
        default: return 'bg-secondary text-slate-700 border-border';
    }
}

export function BottlenecksPage() {
    const criticalCount = bottleneckData.filter(b => b.severity === 'critical').length;
    const totalStuckPRs = bottleneckData.reduce((sum, b) => sum + b.prsStuck, 0);
    const avgQueueTime = bottleneckData.reduce((sum, b) => sum + b.avgTime, 0) / bottleneckData.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Bottleneck Detection</h2>
                    <p className="text-muted-foreground mt-1">Identify and resolve workflow blockers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-card border border-border text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-secondary transition-all">
                        <Calendar className="size-4" />
                        Last 7 Days
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                        <Download className="size-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Alert Banner */}
            {criticalCount > 0 && (
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-card/20 p-3 rounded-xl">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{criticalCount} Critical Bottleneck Detected</h3>
                            <p className="text-rose-100">{totalStuckPRs} PRs are stuck in the pipeline and need attention</p>
                        </div>
                    </div>
                    <button className="bg-card text-rose-600 px-4 py-2 rounded-xl font-medium hover:bg-rose-50 transition-colors flex items-center gap-2">
                        <Zap className="size-4" />
                        Quick Actions
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Critical Bottlenecks</span>
                        <AlertTriangle className="size-5 text-rose-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{criticalCount}</p>
                    <p className="text-xs text-rose-600 mt-1">Requires immediate action</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">PRs Stuck</span>
                        <GitPullRequest className="size-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{totalStuckPRs}</p>
                    <p className="text-xs text-amber-600 mt-1">Across all stages</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Avg Queue Time</span>
                        <Timer className="size-5 text-primary" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{avgQueueTime.toFixed(1)}h</p>
                    <p className="text-xs text-primary mt-1">Per stage</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Stale PRs</span>
                        <Clock className="size-5 text-violet-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{stalePRs.length}</p>
                    <p className="text-xs text-violet-600 mt-1">Older than 7 days</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline Flow */}
                <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Pipeline Flow</h3>
                        <p className="text-sm text-muted-foreground">PRs in each stage of the pipeline</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={pipelineFlowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar dataKey="prs" fill="#3b82f6" radius={[6, 6, 0, 0]} name="PRs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Queue Time by Day */}
                <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Daily Queue Time</h3>
                        <p className="text-sm text-muted-foreground">Hours spent waiting vs in review</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={queueTimeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} unit="h" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar dataKey="waiting" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Waiting for Review" />
                            <Bar dataKey="inReview" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="In Review" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottleneck Details */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-1">Bottleneck Analysis</h3>
                    <p className="text-sm text-muted-foreground">Detailed breakdown by pipeline stage</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bottleneckData.map((bottleneck) => (
                        <div
                            key={bottleneck.stage}
                            className={`rounded-xl p-5 border ${getSeverityBg(bottleneck.severity)}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-foreground">{bottleneck.stage}</span>
                                <div className={`size-3 rounded-full ${getSeverityColor(bottleneck.severity)}`} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Avg Wait Time</span>
                                    <span className="font-semibold text-foreground">{bottleneck.avgTime}h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">PRs Stuck</span>
                                    <span className="font-semibold text-foreground">{bottleneck.prsStuck}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stale PRs */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Stale Pull Requests</h3>
                        <p className="text-sm text-muted-foreground">PRs that have been open for too long</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary font-medium flex items-center gap-1">
                        View All <ArrowRight className="size-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {stalePRs.map((pr) => (
                        <div
                            key={pr.id}
                            className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className={`size-5 ${pr.age > 10 ? 'text-rose-500' : 'text-amber-500'}`} />
                                    <span className="font-medium text-foreground">{pr.id}</span>
                                </div>
                                <span className="text-muted-foreground">{pr.title}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">by {pr.author}</span>
                                <span className={`text-sm font-medium ${pr.age > 10 ? 'text-rose-600' : 'text-amber-600'}`}>
                                    {pr.age} days old
                                </span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${getStatusBadge(pr.status)}`}>
                                    {pr.status.replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

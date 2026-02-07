import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Rocket, Clock, AlertTriangle, CheckCircle2, Target, Zap, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { doraMetrics, deploymentTrendData, leadTimeBreakdownData, doraRatingThresholds } from '@/lib/doraMetricsData';

// Weekly trend data for all metrics
const weeklyTrendData = [
    { week: 'W1', deployments: 22, leadTime: 3.2, mttr: 65, cfr: 4.8 },
    { week: 'W2', deployments: 28, leadTime: 2.8, mttr: 55, cfr: 4.2 },
    { week: 'W3', deployments: 25, leadTime: 2.5, mttr: 48, cfr: 3.8 },
    { week: 'W4', deployments: 32, leadTime: 2.3, mttr: 45, cfr: 3.2 },
];

// MTTR incidents data
const mttrIncidentsData = [
    { date: '02/01', incidents: 2, avgRecovery: 45 },
    { date: '02/02', incidents: 1, avgRecovery: 32 },
    { date: '02/03', incidents: 3, avgRecovery: 58 },
    { date: '02/04', incidents: 1, avgRecovery: 28 },
    { date: '02/05', incidents: 2, avgRecovery: 42 },
    { date: '02/06', incidents: 0, avgRecovery: 0 },
    { date: '02/07', incidents: 1, avgRecovery: 38 },
];

function getRatingColor(rating: string) {
    switch (rating) {
        case 'elite': return 'from-emerald-500 to-emerald-600';
        case 'high': return 'from-blue-500 to-blue-600';
        case 'medium': return 'from-amber-500 to-amber-600';
        case 'low': return 'from-rose-500 to-rose-600';
        default: return 'from-slate-500 to-slate-600';
    }
}

function getRatingBgColor(rating: string) {
    switch (rating) {
        case 'elite': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
        case 'high': return 'bg-blue-50 border-blue-200 text-blue-700';
        case 'medium': return 'bg-amber-50 border-amber-200 text-amber-700';
        case 'low': return 'bg-rose-50 border-rose-200 text-rose-700';
        default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
}

function getMetricIcon(name: string) {
    switch (name) {
        case 'Deployment Frequency': return Rocket;
        case 'Lead Time for Changes': return Clock;
        case 'Mean Time to Recovery': return AlertTriangle;
        case 'Change Failure Rate': return CheckCircle2;
        default: return Target;
    }
}

export function DORAMetricsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">DORA Metrics</h2>
                    <p className="text-slate-600 mt-1">DevOps Research & Assessment performance indicators</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all">
                        <Calendar className="size-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                        <Download className="size-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* DORA Rating Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30">
                            <Zap className="size-8 text-emerald-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">Overall DORA Rating: <span className="text-emerald-300">Elite</span></h3>
                            <p className="text-slate-300 mt-1">Your team is performing at the highest level of software delivery</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-emerald-300">3/4</p>
                            <p className="text-sm text-slate-400">Elite Metrics</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-300">1/4</p>
                            <p className="text-sm text-slate-400">High Metrics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {doraMetrics.map((metric) => {
                    const Icon = getMetricIcon(metric.name);
                    const isPositiveTrend = metric.trendDirection === 'up' ?
                        (metric.name === 'Deployment Frequency') :
                        (metric.name !== 'Deployment Frequency');

                    return (
                        <div
                            key={metric.name}
                            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`bg-gradient-to-br ${getRatingColor(metric.rating)} p-2.5 rounded-xl shadow-lg`}>
                                    <Icon className="size-5 text-white" />
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getRatingBgColor(metric.rating)} capitalize`}>
                                    {metric.rating}
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 mb-1">{metric.name}</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-2xl font-bold text-slate-900">{metric.current}</span>
                                <span className="text-sm text-slate-500">{metric.unit}</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-500">Target: {metric.target} {metric.unit}</span>
                                <div className={`flex items-center gap-1 text-sm font-medium ${isPositiveTrend ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {isPositiveTrend ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                    {metric.trend}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deployment Frequency Trend */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Deployment Frequency</h3>
                        <p className="text-sm text-slate-600">Daily deployments over the past week</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={deploymentTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
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
                            <Legend />
                            <Bar dataKey="deployments" fill="#10b981" radius={[6, 6, 0, 0]} name="Deployments" />
                            <Bar dataKey="target" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Target" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Lead Time Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Lead Time Breakdown</h3>
                        <p className="text-sm text-slate-600">Time distribution across delivery stages</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={leadTimeBreakdownData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} unit="h" />
                            <YAxis dataKey="stage" type="category" tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                }}
                                formatter={(value: number) => [`${value}h`, 'Time']}
                            />
                            <Bar dataKey="time" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly Trends */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-1">Weekly Performance Trends</h3>
                    <p className="text-sm text-slate-600">All DORA metrics over the past 4 weeks</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} />
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
                        <Legend />
                        <Line type="monotone" dataKey="deployments" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Deployments" />
                        <Line type="monotone" dataKey="leadTime" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="Lead Time (days)" />
                        <Line type="monotone" dataKey="mttr" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} name="MTTR (min)" />
                        <Line type="monotone" dataKey="cfr" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} name="CFR (%)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* MTTR Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Incident Recovery Trend</h3>
                        <p className="text-sm text-slate-600">Daily incidents and average recovery time</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={mttrIncidentsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
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
                            <Legend />
                            <Area type="monotone" dataKey="avgRecovery" fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} name="Avg Recovery (min)" />
                            <Area type="monotone" dataKey="incidents" fill="#fee2e2" stroke="#ef4444" strokeWidth={2} name="Incidents" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* DORA Rating Guide */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-4">DORA Rating Guide</h3>
                    <div className="space-y-3">
                        {[
                            { rating: 'elite', color: 'bg-emerald-500', label: 'Elite Performer', desc: 'Top tier, multiple deploys/day' },
                            { rating: 'high', color: 'bg-blue-500', label: 'High Performer', desc: 'Weekly to daily deployments' },
                            { rating: 'medium', color: 'bg-amber-500', label: 'Medium Performer', desc: 'Monthly to weekly cycle' },
                            { rating: 'low', color: 'bg-rose-500', label: 'Low Performer', desc: 'Less than monthly deployments' },
                        ].map((item) => (
                            <div key={item.rating} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className={`size-3 rounded-full ${item.color}`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calculator, PiggyBank, Building2, Calendar, Download, RefreshCw, Users, Target, AlertTriangle } from 'lucide-react';

// Mock cost data - will be replaced with real API data
const costByProject = [
    { name: 'Frontend', cost: 45000, planned: 40000, roi: 320 },
    { name: 'Backend API', cost: 62000, planned: 55000, roi: 280 },
    { name: 'Mobile App', cost: 38000, planned: 45000, roi: 410 },
    { name: 'Infrastructure', cost: 28000, planned: 30000, roi: 520 },
    { name: 'Data Pipeline', cost: 34000, planned: 35000, roi: 380 },
];

const monthlyTrend = [
    { month: 'Aug', cost: 180000, planned: 175000, efficiency: 87 },
    { month: 'Sep', cost: 195000, planned: 190000, efficiency: 89 },
    { month: 'Oct', cost: 210000, planned: 200000, efficiency: 85 },
    { month: 'Nov', cost: 188000, planned: 195000, efficiency: 92 },
    { month: 'Dec', cost: 175000, planned: 180000, efficiency: 94 },
    { month: 'Jan', cost: 192000, planned: 185000, efficiency: 88 },
];

const costBreakdown = [
    { name: 'Salaries', value: 68, color: '#3b82f6' },
    { name: 'Infrastructure', value: 15, color: '#8b5cf6' },
    { name: 'Tools & Licenses', value: 8, color: '#f59e0b' },
    { name: 'Training', value: 5, color: '#10b981' },
    { name: 'Other', value: 4, color: '#6b7280' },
];

const featureCosts = [
    { feature: 'User Authentication', hours: 120, cost: 9600, status: 'completed', roi: '450%' },
    { feature: 'Dashboard Analytics', hours: 200, cost: 16000, status: 'completed', roi: '380%' },
    { feature: 'API Integration', hours: 160, cost: 12800, status: 'in-progress', roi: 'TBD' },
    { feature: 'Notification System', hours: 80, cost: 6400, status: 'in-progress', roi: 'TBD' },
    { feature: 'Reporting Module', hours: 240, cost: 19200, status: 'planned', roi: 'Est. 520%' },
];

export function CostIntelligencePage() {
    const [isLoading, setIsLoading] = useState(false);

    const totalCost = costByProject.reduce((sum, p) => sum + p.cost, 0);
    const totalPlanned = costByProject.reduce((sum, p) => sum + p.planned, 0);
    const avgROI = Math.round(costByProject.reduce((sum, p) => sum + p.roi, 0) / costByProject.length);
    const budgetVariance = ((totalCost - totalPlanned) / totalPlanned * 100).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Cost Intelligence</h2>
                    <p className="text-slate-600 mt-1">Engineering investment analysis and ROI tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all">
                        <Calendar className="size-4" />
                        Q4 2025
                    </button>
                    <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                        <Download className="size-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Unique Feature Banner */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-4 rounded-2xl">
                            <DollarSign className="size-8" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-sm font-medium">🎯 Polaris Exclusive</p>
                            <h3 className="text-2xl font-bold">Engineering Cost Visibility</h3>
                            <p className="text-emerald-100 mt-1">Know exactly what each feature costs to build</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold">{avgROI}%</p>
                        <p className="text-emerald-100">Average ROI</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Total Engineering Cost</span>
                        <Building2 className="size-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">${(totalCost / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">This quarter</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Budget Variance</span>
                        {parseFloat(budgetVariance) > 0 ? (
                            <TrendingUp className="size-5 text-rose-600" />
                        ) : (
                            <TrendingDown className="size-5 text-emerald-600" />
                        )}
                    </div>
                    <p className={`text-3xl font-semibold ${parseFloat(budgetVariance) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {parseFloat(budgetVariance) > 0 ? '+' : ''}{budgetVariance}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">vs planned budget</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Cost per Developer</span>
                        <Users className="size-5 text-violet-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">$12.4K</p>
                    <p className="text-xs text-violet-600 mt-1">Monthly average</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Engineering Efficiency</span>
                        <Target className="size-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-semibold text-emerald-600">91%</p>
                    <p className="text-xs text-slate-500 mt-1">Utilization rate</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost by Project */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Cost by Project</h3>
                        <p className="text-sm text-slate-600">Actual vs planned spending</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={costByProject}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}K`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            />
                            <Bar dataKey="cost" fill="#3b82f6" name="Actual" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="planned" fill="#e2e8f0" name="Planned" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-1">Cost Breakdown</h3>
                        <p className="text-sm text-slate-600">Where the money goes</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <ResponsiveContainer width="50%" height={220}>
                            <PieChart>
                                <Pie
                                    data={costBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {costBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-3">
                            {costBreakdown.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm text-slate-600">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-1">Monthly Cost Trend</h3>
                    <p className="text-sm text-slate-600">Cost and efficiency over time</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}K`} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 12 }} unit="%" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '12px',
                            }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="cost" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Actual Cost" />
                        <Area yAxisId="left" type="monotone" dataKey="planned" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} name="Planned" />
                        <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Efficiency %" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Feature Cost Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Cost Per Feature</h3>
                        <p className="text-sm text-slate-600">Engineering investment by deliverable</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Calculator className="size-4" />
                        Estimate New Feature
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Feature</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Hours</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Cost</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureCosts.map((feature) => (
                                <tr key={feature.feature} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-4 px-4 font-medium text-slate-900">{feature.feature}</td>
                                    <td className="py-4 px-4 text-right text-slate-600">{feature.hours}h</td>
                                    <td className="py-4 px-4 text-right font-semibold text-slate-900">${feature.cost.toLocaleString()}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-center">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${feature.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    feature.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {feature.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right font-semibold text-emerald-600">{feature.roi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

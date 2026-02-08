import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts';
import { Users, Brain, AlertTriangle, TrendingUp, Target, Heart, UserPlus, GraduationCap, Clock, Briefcase, RefreshCw, Sparkles } from 'lucide-react';

// Mock workforce data - will be replaced with real API + AI data
const teamCapacity = [
    { name: 'Frontend', current: 8, needed: 10, utilization: 95 },
    { name: 'Backend', current: 6, needed: 8, utilization: 85 },
    { name: 'DevOps', current: 3, needed: 4, utilization: 110 },
    { name: 'QA', current: 4, needed: 5, utilization: 88 },
    { name: 'Data', current: 3, needed: 5, utilization: 75 },
];

const skillGaps = [
    { skill: 'Kubernetes', demand: 85, supply: 45, gap: 40, priority: 'critical' },
    { skill: 'React Native', demand: 70, supply: 35, gap: 35, priority: 'high' },
    { skill: 'Machine Learning', demand: 60, supply: 25, gap: 35, priority: 'high' },
    { skill: 'GraphQL', demand: 55, supply: 40, gap: 15, priority: 'medium' },
    { skill: 'Rust', demand: 40, supply: 15, gap: 25, priority: 'medium' },
];

const burnoutRisk = [
    { name: 'Low Risk', value: 65, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' },
];

const hiringROI = [
    { role: 'Senior DevOps Engineer', salary: 150000, impactScore: 92, roi: 340, timeToFill: '45 days', priority: 'critical' },
    { role: 'ML Engineer', salary: 165000, impactScore: 88, roi: 280, timeToFill: '60 days', priority: 'high' },
    { role: 'React Native Developer', salary: 130000, impactScore: 85, roi: 310, timeToFill: '30 days', priority: 'high' },
    { role: 'QA Automation Lead', salary: 120000, impactScore: 78, roi: 250, timeToFill: '35 days', priority: 'medium' },
];

const skillRadar = [
    { skill: 'Frontend', A: 85, fullMark: 100 },
    { skill: 'Backend', A: 75, fullMark: 100 },
    { skill: 'DevOps', A: 60, fullMark: 100 },
    { skill: 'Data Science', A: 45, fullMark: 100 },
    { skill: 'Mobile', A: 40, fullMark: 100 },
    { skill: 'Security', A: 55, fullMark: 100 },
];

export function WorkforceIntelligencePage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState<string | null>(null);

    const totalTeamSize = teamCapacity.reduce((sum, t) => sum + t.current, 0);
    const neededHires = teamCapacity.reduce((sum, t) => sum + Math.max(0, t.needed - t.current), 0);
    const avgUtilization = Math.round(teamCapacity.reduce((sum, t) => sum + t.utilization, 0) / teamCapacity.length);
    const criticalGaps = skillGaps.filter(s => s.priority === 'critical').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Workforce Intelligence</h2>
                    <p className="text-muted-foreground mt-1">AI-powered workforce optimization and capacity planning</p>
                </div>
                <button
                    onClick={() => setIsAnalyzing(true)}
                    className="flex items-center gap-2 bg-gradient-to-br from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-violet-500/20"
                >
                    <Sparkles className="size-4" />
                    AI Analysis
                </button>
            </div>

            {/* Unique Feature Banner */}
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-card/20 p-4 rounded-2xl">
                            <Brain className="size-8" />
                        </div>
                        <div>
                            <p className="text-violet-100 text-sm font-medium">🎯 Polaris Exclusive</p>
                            <h3 className="text-2xl font-bold">HR-Focused Workforce Analytics</h3>
                            <p className="text-violet-100 mt-1">Skill gaps, burnout risk, and hiring ROI in one view</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold">{neededHires}</p>
                        <p className="text-violet-100">Recommended Hires</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Team Size</span>
                        <Users className="size-5 text-primary" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{totalTeamSize}</p>
                    <p className="text-xs text-primary mt-1">Across all teams</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Avg Utilization</span>
                        <Target className="size-5 text-emerald-600" />
                    </div>
                    <p className={`text-3xl font-semibold ${avgUtilization > 100 ? 'text-rose-600' : avgUtilization > 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {avgUtilization}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{avgUtilization > 95 ? 'Overloaded' : 'Healthy'}</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Critical Skill Gaps</span>
                        <AlertTriangle className="size-5 text-rose-600" />
                    </div>
                    <p className="text-3xl font-semibold text-rose-600">{criticalGaps}</p>
                    <p className="text-xs text-rose-600 mt-1">Need immediate action</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Burnout Risk</span>
                        <Heart className="size-5 text-violet-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">10%</p>
                    <p className="text-xs text-violet-600 mt-1">High risk employees</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Capacity */}
                <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Team Capacity</h3>
                        <p className="text-sm text-muted-foreground">Current headcount vs needed</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={teamCapacity} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar dataKey="current" fill="#3b82f6" name="Current" radius={[0, 6, 6, 0]} />
                            <Bar dataKey="needed" fill="#e2e8f0" name="Needed" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Skill Radar */}
                <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Team Skill Coverage</h3>
                        <p className="text-sm text-muted-foreground">Current capability strength</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadar}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Skill Gaps & Burnout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skill Gaps */}
                <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Skill Gap Analysis</h3>
                        <p className="text-sm text-muted-foreground">Demand vs supply for key skills</p>
                    </div>
                    <div className="space-y-4">
                        {skillGaps.map((skill) => (
                            <div key={skill.skill} className="flex items-center gap-4">
                                <div className="w-28 font-medium text-foreground">{skill.skill}</div>
                                <div className="flex-1">
                                    <div className="h-6 bg-secondary rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-slate-300 rounded-full"
                                            style={{ width: `${skill.demand}%` }}
                                        />
                                        <div
                                            className={`absolute inset-y-0 left-0 rounded-full ${skill.priority === 'critical' ? 'bg-rose-500' :
                                                    skill.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${skill.supply}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-16 text-right">
                                    <span className={`text-sm font-semibold ${skill.priority === 'critical' ? 'text-rose-600' :
                                            skill.priority === 'high' ? 'text-amber-600' : 'text-primary'
                                        }`}>-{skill.gap}%</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${skill.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                                        skill.priority === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/20 text-primary'
                                    }`}>
                                    {skill.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Burnout Risk */}
                <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-foreground mb-1">Burnout Risk</h3>
                        <p className="text-sm text-muted-foreground">Employee wellness indicators</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={burnoutRisk}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {burnoutRisk.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                        {burnoutRisk.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="font-semibold text-foreground">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hiring ROI Table */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Hiring ROI Calculator</h3>
                        <p className="text-sm text-muted-foreground">Prioritized hiring recommendations with business impact</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium">
                        <UserPlus className="size-4" />
                        Add Position
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Salary</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Impact Score</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Est. ROI</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Time to Fill</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hiringROI.map((hire) => (
                                <tr key={hire.role} className="border-b border-border/50 hover:bg-secondary">
                                    <td className="py-4 px-4 font-medium text-foreground">{hire.role}</td>
                                    <td className="py-4 px-4 text-right text-muted-foreground">${hire.salary.toLocaleString()}</td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${hire.impactScore}%` }} />
                                            </div>
                                            <span className="font-semibold text-foreground">{hire.impactScore}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right font-semibold text-emerald-600">{hire.roi}%</td>
                                    <td className="py-4 px-4 text-right text-muted-foreground">{hire.timeToFill}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-center">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${hire.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                                                    hire.priority === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/20 text-primary'
                                                }`}>
                                                {hire.priority}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

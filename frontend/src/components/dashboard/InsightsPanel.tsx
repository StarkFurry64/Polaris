import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  ArrowRightCircle,
} from 'lucide-react';

/* ---------------- Existing Data ---------------- */

const skillData = [
  { skill: 'React', current: 85, required: 90 },
  { skill: 'Python', current: 70, required: 95 },
  { skill: 'ML/AI', current: 60, required: 85 },
  { skill: 'DevOps', current: 75, required: 80 },
  { skill: 'Design', current: 90, required: 85 },
];

const performanceData = [
  { month: 'Jan', efficiency: 72, quality: 78 },
  { month: 'Feb', efficiency: 75, quality: 80 },
  { month: 'Mar', efficiency: 79, quality: 82 },
  { month: 'Apr', efficiency: 83, quality: 85 },
  { month: 'May', efficiency: 87, quality: 88 },
  { month: 'Jun', efficiency: 89, quality: 92 },
];

/* ---------------- AI Resource Optimization Insights ---------------- */

const resourceInsights = [
  {
    title: 'Backend Team Overloaded',
    insight: 'Backend team has 42% higher active workload than other teams.',
    recommendation: 'Reassign 2 authentication tasks to Platform team.',
  },
  {
    title: 'Bottleneck Detected in Auth Tasks',
    insight: 'Authentication-related tasks are stuck in progress for >3 days.',
    recommendation: 'Add an additional reviewer from Infra team.',
  },
  {
    title: 'Frontend Team Underutilized',
    insight: 'Frontend team has lower task utilization this sprint.',
    recommendation: 'Move UI-related auth work to Frontend team.',
  },
];

/* ---------------- Component ---------------- */

export function InsightsPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">
              Real-Time Insights
            </h3>
            <p className="text-sm text-slate-600">
              AI-powered analysis updated 2 minutes ago
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
              <TrendingUp className="size-4" />
              <span className="font-medium">+12% efficiency</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ---------------- AI RESOURCE OPTIMIZATION ---------------- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-5 text-indigo-600" />
            <h4 className="font-medium text-slate-900">
              AI Resource Optimization Insights
            </h4>
          </div>

          <div className="space-y-3">
            {resourceInsights.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50"
              >
                <h5 className="font-medium text-slate-900 mb-1">
                  {item.title}
                </h5>
                <p className="text-sm text-slate-600">{item.insight}</p>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-indigo-600 font-medium">
                  <ArrowRightCircle className="size-4" />
                  {item.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Skill Gap Chart ---------------- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-900">Team Skill Coverage</h4>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 bg-blue-500 rounded-full" />
                <span className="text-slate-600">Current Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 bg-slate-300 rounded-full" />
                <span className="text-slate-600">Required Level</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 12 }} />
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
              <Bar dataKey="current" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="required" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------- Performance Trend ---------------- */}
        <div>
          <h4 className="font-medium text-slate-900 mb-4">
            Performance Trend
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
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
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------- Quick Stats ---------------- */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <CheckCircle2 className="size-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
            <p className="font-semibold text-slate-900">47 Tasks</p>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Clock className="size-4" />
              <span className="text-xs font-medium">In Progress</span>
            </div>
            <p className="font-semibold text-slate-900">23 Tasks</p>
          </div>

          <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100/50">
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertCircle className="size-4" />
              <span className="text-xs font-medium">At Risk</span>
            </div>
            <p className="font-semibold text-slate-900">5 Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

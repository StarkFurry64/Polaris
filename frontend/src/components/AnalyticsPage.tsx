import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Target, Code2, Download, Calendar } from 'lucide-react';

const projectData = [
  { name: 'Jan', completed: 12, ongoing: 8, planned: 5 },
  { name: 'Feb', completed: 15, ongoing: 10, planned: 6 },
  { name: 'Mar', completed: 18, ongoing: 12, planned: 8 },
  { name: 'Apr', completed: 22, ongoing: 9, planned: 7 },
  { name: 'May', completed: 25, ongoing: 11, planned: 9 },
  { name: 'Jun', completed: 28, ongoing: 13, planned: 10 },
];

const skillDistribution = [
  { name: 'Frontend', value: 35, color: '#3b82f6' },
  { name: 'Backend', value: 30, color: '#8b5cf6' },
  { name: 'ML/AI', value: 20, color: '#10b981' },
  { name: 'DevOps', value: 15, color: '#f59e0b' },
];

const techStackData = [
  { tech: 'React', usage: 92 },
  { tech: 'Python', usage: 85 },
  { tech: 'PostgreSQL', usage: 78 },
  { tech: 'Docker', usage: 88 },
  { tech: 'AWS', usage: 75 },
  { tech: 'TensorFlow', usage: 65 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Analytics Dashboard</h2>
          <p className="text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all">
            <Calendar className="size-4" />
            Last 6 Months
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
            <Download className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Target className="size-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Success Rate</span>
          </div>
          <p className="text-3xl font-semibold mb-1">94.2%</p>
          <p className="text-sm opacity-80">+2.4% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white shadow-lg shadow-violet-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="size-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Team Velocity</span>
          </div>
          <p className="text-3xl font-semibold mb-1">87 pts</p>
          <p className="text-sm opacity-80">+12 points this sprint</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Efficiency</span>
          </div>
          <p className="text-3xl font-semibold mb-1">89%</p>
          <p className="text-sm opacity-80">+7% improvement</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg shadow-rose-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Code2 className="size-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Code Quality</span>
          </div>
          <p className="text-3xl font-semibold mb-1">8.7/10</p>
          <p className="text-sm opacity-80">Excellent rating</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-1">Project Progress</h3>
            <p className="text-sm text-slate-600">Monthly project completion trends</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
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
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="ongoing" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Ongoing" />
              <Bar dataKey="planned" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-1">Skill Distribution</h3>
            <p className="text-sm text-slate-600">Team expertise breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tech Stack Usage */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-1">Technology Stack Usage</h3>
          <p className="text-sm text-slate-600">Adoption rates across the organization</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={techStackData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis dataKey="tech" type="category" tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="usage" fill="#3b82f6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

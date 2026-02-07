import { Users, TrendingUp, TrendingDown, AlertCircle, Mail, Star } from 'lucide-react';

export function TeamsPage() {
  const teams = [
    {
      id: 1,
      name: 'Frontend Development',
      lead: 'Sarah Chen',
      members: 8,
      efficiency: 92,
      trend: 'up',
      skills: ['React', 'TypeScript', 'CSS'],
      gaps: ['Testing', 'Accessibility'],
      avatar: 'SC',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'Backend Engineering',
      lead: 'Marcus Johnson',
      members: 6,
      efficiency: 85,
      trend: 'up',
      skills: ['Python', 'PostgreSQL', 'Docker'],
      gaps: ['Kubernetes', 'Redis'],
      avatar: 'MJ',
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 3,
      name: 'ML/AI Team',
      lead: 'Dr. Aisha Patel',
      members: 5,
      efficiency: 78,
      trend: 'down',
      skills: ['Python', 'TensorFlow', 'BERT'],
      gaps: ['MLOps', 'Data Engineering'],
      avatar: 'AP',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 4,
      name: 'DevOps',
      lead: 'Alex Rivera',
      members: 4,
      efficiency: 88,
      trend: 'up',
      skills: ['AWS', 'Terraform', 'CI/CD'],
      gaps: ['Security', 'Monitoring'],
      avatar: 'AR',
      color: 'from-rose-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Teams Overview</h2>
          <p className="text-slate-600 mt-1">Manage and optimize your team composition</p>
        </div>
        <button className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
          Create New Team
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Teams</span>
            <Users className="size-5 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">4</p>
          <p className="text-xs text-emerald-600 mt-1">+1 this quarter</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Members</span>
            <Users className="size-5 text-violet-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">23</p>
          <p className="text-xs text-emerald-600 mt-1">+3 this month</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Avg Efficiency</span>
            <TrendingUp className="size-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">86%</p>
          <p className="text-xs text-emerald-600 mt-1">+4% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Skill Gaps</span>
            <AlertCircle className="size-5 text-rose-600" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">8</p>
          <p className="text-xs text-rose-600 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
          >
            {/* Team Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-br ${team.color} size-12 rounded-xl flex items-center justify-center shadow-lg`}>
                  <Users className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{team.name}</h3>
                  <p className="text-sm text-slate-600">{team.members} members</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-slate-900">{team.efficiency}%</span>
              </div>
            </div>

            {/* Team Lead */}
            <div className="flex items-center gap-3 mb-4 bg-slate-50 rounded-lg p-3">
              <div className="size-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {team.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{team.lead}</p>
                <p className="text-xs text-slate-600">Team Lead</p>
              </div>
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <Mail className="size-4" />
              </button>
            </div>

            {/* Skills */}
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-700 mb-2">Core Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {team.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Gaps */}
            <div>
              <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                <AlertCircle className="size-3 text-rose-500" />
                Skill Gaps
              </p>
              <div className="flex flex-wrap gap-1.5">
                {team.gaps.map((gap, idx) => (
                  <span
                    key={idx}
                    className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-lg border border-rose-100"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>

            {/* Trend */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">Performance Trend</span>
              <div className={`flex items-center gap-1.5 ${team.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {team.trend === 'up' ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm font-semibold">
                  {team.trend === 'up' ? '+5%' : '-3%'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

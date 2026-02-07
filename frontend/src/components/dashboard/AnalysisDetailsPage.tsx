import { ArrowLeft, Download, Share2, Brain, Target, Users, TrendingUp, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalysisDetailsPageProps {
  onBack: () => void;
}

const skillGapData = [
  { category: 'Frontend', current: 85, required: 90, gap: 5 },
  { category: 'Backend', current: 70, required: 95, gap: 25 },
  { category: 'ML/AI', current: 60, required: 85, gap: 25 },
  { category: 'DevOps', current: 75, required: 80, gap: 5 },
  { category: 'Design', current: 90, required: 85, gap: 0 },
  { category: 'Testing', current: 65, required: 90, gap: 25 },
];

const teamPerformanceData = [
  { subject: 'Velocity', A: 85, B: 78 },
  { subject: 'Quality', A: 92, B: 85 },
  { subject: 'Collaboration', A: 88, B: 82 },
  { subject: 'Innovation', A: 75, B: 70 },
  { subject: 'Delivery', A: 90, B: 88 },
];

const recommendationTimeline = [
  { month: 'Feb', efficiency: 72, projected: 72 },
  { month: 'Mar', efficiency: 75, projected: 76 },
  { month: 'Apr', efficiency: 79, projected: 81 },
  { month: 'May', efficiency: 83, projected: 86 },
  { month: 'Jun', efficiency: 87, projected: 91 },
  { month: 'Jul', efficiency: null, projected: 95 },
];

export function AnalysisDetailsPage({ onBack }: AnalysisDetailsPageProps) {
  const criticalFindings = [
    {
      id: 1,
      type: 'critical',
      icon: AlertTriangle,
      title: 'ML/AI Team Capacity Gap',
      description: 'Current team size insufficient for Q2 project pipeline. Analysis of Jira tickets shows 47% increase in ML-related tasks.',
      impact: 'High',
      recommendation: 'Hire 2 senior ML engineers with Kubernetes and MLOps experience',
      timeline: '30-45 days',
      resources: '$180K-$220K annual budget',
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Testing Coverage Below Industry Standard',
      description: 'GitHub analysis reveals only 65% test coverage across repositories. Industry standard is 90%+.',
      impact: 'Medium',
      recommendation: 'Implement testing bootcamp and pair senior QA engineer with each team',
      timeline: '60 days',
      resources: '2 senior QA engineers',
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle2,
      title: 'Frontend Excellence Maintained',
      description: 'Team demonstrates 92% efficiency with strong React/TypeScript capabilities. Code quality metrics exceed targets.',
      impact: 'Positive',
      recommendation: 'Document best practices and establish mentorship program',
      timeline: 'Ongoing',
      resources: 'Internal time allocation',
    },
  ];

  const actionItems = [
    {
      id: 1,
      priority: 'urgent',
      title: 'Initiate ML Engineer Hiring',
      description: 'Post job listings and activate recruiter network',
      owner: 'HR & Engineering Leadership',
      dueDate: 'Feb 14, 2026',
      status: 'pending',
    },
    {
      id: 2,
      priority: 'high',
      title: 'Kubernetes Training Program',
      description: 'Enroll ML team in certification course',
      owner: 'DevOps Lead',
      dueDate: 'Feb 21, 2026',
      status: 'pending',
    },
    {
      id: 3,
      priority: 'medium',
      title: 'Testing Framework Audit',
      description: 'Review current testing practices and gaps',
      owner: 'QA Team Lead',
      dueDate: 'Feb 28, 2026',
      status: 'in-progress',
    },
    {
      id: 4,
      priority: 'medium',
      title: 'Documentation Sprint',
      description: 'Create frontend best practices guide',
      owner: 'Frontend Team',
      dueDate: 'Mar 7, 2026',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Detailed Analysis Report</h2>
            <p className="text-slate-600 mt-1">Generated on February 7, 2026 at 2:34 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all">
            <Share2 className="size-4" />
            Share
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
            <Download className="size-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-400/30">
              <Brain className="size-6 text-blue-200" />
            </div>
            <h3 className="text-xl font-semibold">Executive Summary</h3>
          </div>
          
          <p className="text-lg text-slate-200 mb-6 leading-relaxed">
            Analysis of 156 Jira issues, 24 GitHub repositories, and 4 team datasets reveals <strong>3 critical insights</strong> requiring immediate attention. 
            Current team efficiency at 87% with potential to reach 95% through targeted interventions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-5 text-blue-300" />
                <span className="text-sm text-slate-300">Skill Gaps</span>
              </div>
              <p className="text-2xl font-semibold">8 Critical</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-5 text-emerald-300" />
                <span className="text-sm text-slate-300">Teams Analyzed</span>
              </div>
              <p className="text-2xl font-semibold">4 Teams</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-violet-300" />
                <span className="text-sm text-slate-300">Efficiency Gain</span>
              </div>
              <p className="text-2xl font-semibold">+8% Potential</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-5 text-rose-300" />
                <span className="text-sm text-slate-300">Action Items</span>
              </div>
              <p className="text-2xl font-semibold">4 Urgent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Findings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="size-5 text-rose-600" />
          Critical Findings & Recommendations
        </h3>
        
        <div className="space-y-4">
          {criticalFindings.map((finding) => {
            const Icon = finding.icon;
            return (
              <div
                key={finding.id}
                className={`border-2 rounded-xl p-5 ${
                  finding.type === 'critical'
                    ? 'bg-rose-50/50 border-rose-200'
                    : finding.type === 'warning'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      finding.type === 'critical'
                        ? 'bg-rose-100 text-rose-600'
                        : finding.type === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    <Icon className="size-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{finding.title}</h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          finding.impact === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : finding.impact === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {finding.impact} Impact
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">{finding.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white/60 rounded-lg border border-slate-200/50">
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Recommendation</p>
                        <p className="text-sm text-slate-900">{finding.recommendation}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Timeline</p>
                        <p className="text-sm text-slate-900">{finding.timeline}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Resources</p>
                        <p className="text-sm text-slate-900">{finding.resources}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Skill Gap Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillGapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
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
              <Bar dataKey="current" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Current" />
              <Bar dataKey="required" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Required" />
              <Bar dataKey="gap" fill="#ef4444" radius={[6, 6, 0, 0]} name="Gap" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance Radar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Team Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={teamPerformanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Current" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="Target" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Projection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Efficiency Projection with Recommendations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recommendationTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 100]} />
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
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Current Efficiency"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#10b981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', r: 5 }}
              name="Projected (with recommendations)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="size-5 text-blue-600" />
          Recommended Action Items
        </h3>
        
        <div className="space-y-3">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <div
                  className={`size-3 rounded-full ${
                    item.priority === 'urgent'
                      ? 'bg-rose-500'
                      : item.priority === 'high'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      item.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Owner: {item.owner}</span>
                  <span>•</span>
                  <span>Due: {item.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Info className="size-5 text-slate-600" />
          Analysis Methodology & Data Sources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-900 mb-2">Jira Integration</p>
            <p className="text-slate-600">156 issues analyzed across 8 projects, spanning 6 months of activity</p>
          </div>
          <div>
            <p className="font-medium text-slate-900 mb-2">GitHub Analysis</p>
            <p className="text-slate-600">24 repositories scanned, 2,847 commits reviewed, 47 technologies detected</p>
          </div>
          <div>
            <p className="font-medium text-slate-900 mb-2">BERT NLP Processing</p>
            <p className="text-slate-600">Natural language processing applied to ticket descriptions and code comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Zap, CheckCircle2, AlertTriangle, Sparkles, ExternalLink, ThumbsUp } from 'lucide-react';

export function TechStackPage() {
  const recommendations = [
    {
      id: 1,
      category: 'Frontend Framework',
      recommended: 'Next.js 14',
      reason: 'Based on your React expertise and need for SSR/SSG capabilities',
      confidence: 95,
      benefits: ['Better SEO', 'Improved Performance', 'Built-in API Routes'],
      status: 'highly-recommended',
      learning: '2-3 weeks',
    },
    {
      id: 2,
      category: 'State Management',
      recommended: 'Zustand',
      reason: 'Lightweight solution perfect for your project scale',
      confidence: 88,
      benefits: ['Minimal Boilerplate', 'TypeScript Support', 'Easy Learning Curve'],
      status: 'recommended',
      learning: '1 week',
    },
    {
      id: 3,
      category: 'Testing Framework',
      recommended: 'Vitest + Testing Library',
      reason: 'Modern, fast testing aligned with your tech stack',
      confidence: 92,
      benefits: ['Fast Execution', 'Jest Compatible', 'Great DX'],
      status: 'highly-recommended',
      learning: '2 weeks',
    },
    {
      id: 4,
      category: 'Database',
      recommended: 'PostgreSQL + Prisma',
      reason: 'Robust relational database with excellent TypeScript ORM',
      confidence: 90,
      benefits: ['Type Safety', 'Great Migrations', 'Active Community'],
      status: 'highly-recommended',
      learning: '3-4 weeks',
    },
  ];

  const currentStack = [
    { name: 'React', version: '18.2', status: 'current', health: 'excellent' },
    { name: 'TypeScript', version: '5.0', status: 'current', health: 'excellent' },
    { name: 'Tailwind CSS', version: '3.4', status: 'current', health: 'excellent' },
    { name: 'Python', version: '3.11', status: 'current', health: 'good' },
    { name: 'FastAPI', version: '0.104', status: 'update-available', health: 'good' },
    { name: 'TensorFlow', version: '2.13', status: 'update-available', health: 'fair' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tech Stack Advisor</h2>
          <p className="text-slate-600 mt-1">AI-powered recommendations for your projects</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
          <Sparkles className="size-4" />
          Generate New Recommendations
        </button>
      </div>

      {/* Current Stack Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Current Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentStack.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900">{tech.name}</p>
                <p className="text-sm text-slate-600">v{tech.version}</p>
              </div>
              <div className="flex items-center gap-2">
                {tech.status === 'current' ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="size-5 text-amber-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">AI-Powered Recommendations</h3>
          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
            Updated 1 hour ago
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-900">{rec.recommended}</h4>
                    {rec.status === 'highly-recommended' && (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Sparkles className="size-3" />
                        Highly Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{rec.category}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{rec.reason}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-semibold text-slate-900">{rec.confidence}%</span>
                  </div>
                  <p className="text-xs text-slate-600">Confidence</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Key Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {rec.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600">
                    Learning Time: <span className="font-medium text-slate-900">{rec.learning}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-slate-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                    <ThumbsUp className="size-4" />
                  </button>
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    Learn More
                    <ExternalLink className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <Zap className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">Integration Analysis</h3>
            <p className="text-sm text-slate-300">Based on your GitHub repositories and Jira projects</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-300 mb-1">Repositories Analyzed</p>
            <p className="text-2xl font-semibold">24</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-300 mb-1">Technologies Detected</p>
            <p className="text-2xl font-semibold">47</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-300 mb-1">Compatibility Score</p>
            <p className="text-2xl font-semibold">93%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

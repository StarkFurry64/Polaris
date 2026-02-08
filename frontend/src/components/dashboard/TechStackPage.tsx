import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ThumbsUp,
} from 'lucide-react';

export function TechStackPage() {
  /* ---------------- EXISTING STATIC RECOMMENDATIONS ---------------- */

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

  /* ---------------- CURRENT STACK ---------------- */

  const currentStack = [
    { name: 'React', version: '18.2', status: 'current', health: 'excellent' },
    { name: 'TypeScript', version: '5.0', status: 'current', health: 'excellent' },
    { name: 'Tailwind CSS', version: '3.4', status: 'current', health: 'excellent' },
    { name: 'Python', version: '3.11', status: 'current', health: 'good' },
    { name: 'FastAPI', version: '0.104', status: 'update-available', health: 'good' },
    { name: 'TensorFlow', version: '2.13', status: 'update-available', health: 'fair' },
  ];

  /* ---------------- AI DELIVERY-DRIVEN TECH STACK INSIGHTS ---------------- */

  const deliveryDrivenInsights = [
    {
      technology: 'Custom JWT Authentication',
      signal: 'High bug reopen rate in authentication-related Jira issues',
      impact: 'Repeated rework and increased delivery risk',
      recommendation: 'Adopt OAuth2 or a managed identity provider',
      confidence: 'High',
    },
    {
      technology: 'Node.js + Express',
      signal: 'Auth and middleware logic modified across multiple repositories',
      impact: 'High coupling and coordination overhead',
      recommendation: 'Migrate to NestJS for modular architecture and clearer ownership',
      confidence: 'Medium',
    },
    {
      technology: 'Manual CI/CD Scripts',
      signal: 'Delayed PR merges and inconsistent deployment timelines',
      impact: 'Reduced delivery predictability',
      recommendation: 'Standardize pipelines using GitHub Actions reusable workflows',
      confidence: 'High',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Tech Stack Advisor
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered recommendations based on delivery and execution signals
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
          <Sparkles className="size-4" />
          Generate New Recommendations
        </button>
      </div>

      {/* ---------------- CURRENT STACK ---------------- */}
      <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">
          Current Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentStack.map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border/50"
            >
              <div>
                <p className="font-medium text-foreground">{tech.name}</p>
                <p className="text-sm text-muted-foreground">v{tech.version}</p>
              </div>
              {tech.status === 'current' ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-5 text-amber-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- STATIC RECOMMENDATIONS ---------------- */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            AI-Powered Recommendations
          </h3>
          <span className="bg-blue-50 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
            Updated 1 hour ago
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {rec.recommended}
                  </h4>
                  <p className="text-sm text-muted-foreground">{rec.category}</p>
                  <p className="text-sm text-slate-700 mt-1">{rec.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold">{rec.confidence}%</p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {rec.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex justify-between pt-3 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  Learning Time:{' '}
                  <span className="font-medium text-foreground">
                    {rec.learning}
                  </span>
                </span>
                <button className="flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                  Learn More <ExternalLink className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- AI DELIVERY-DRIVEN INSIGHTS ---------------- */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-indigo-600" />
          <h3 className="font-semibold text-foreground">
            AI Delivery-Driven Tech Stack Insights
          </h3>
          <span className="bg-indigo-50 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
            Based on Jira & GitHub
          </span>
        </div>

        <div className="space-y-4">
          {deliveryDrivenInsights.map((item, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-foreground">
                  {item.technology}
                </h4>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-400 font-medium">
                  Confidence: {item.confidence}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Observed Signal:</strong> {item.signal}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Delivery Impact:</strong> {item.impact}
              </p>
              <p className="text-primary font-medium mt-2">
                Recommendation → {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- INTEGRATION STATUS ---------------- */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-card/10 p-2 rounded-lg">
            <Zap className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">Integration Analysis</h3>
            <p className="text-sm text-slate-300">
              Based on GitHub repositories and Jira projects
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/10 rounded-xl p-4">
            <p className="text-sm text-slate-300">Repositories Analyzed</p>
            <p className="text-2xl font-semibold">24</p>
          </div>
          <div className="bg-card/10 rounded-xl p-4">
            <p className="text-sm text-slate-300">Technologies Detected</p>
            <p className="text-2xl font-semibold">47</p>
          </div>
          <div className="bg-card/10 rounded-xl p-4">
            <p className="text-sm text-slate-300">Compatibility Score</p>
            <p className="text-2xl font-semibold">93%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

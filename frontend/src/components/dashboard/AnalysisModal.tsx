import { useState, useEffect } from 'react';
import { X, Brain, CheckCircle2, AlertTriangle, TrendingUp, Zap, Loader2 } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export function AnalysisModal({ isOpen, onClose, onViewDetails }: AnalysisModalProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    { label: 'Scanning Jira Issues', icon: Brain, time: 1500 },
    { label: 'Analyzing GitHub Repos', icon: Zap, time: 2000 },
    { label: 'Processing with BERT NLP', icon: Brain, time: 1800 },
    { label: 'Generating Insights', icon: TrendingUp, time: 1200 },
  ];

  const findings = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Skill Gap Detected',
      description: 'ML/AI team needs Kubernetes expertise for upcoming deployment',
      priority: 'high',
    },
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Optimal Team Composition',
      description: 'Frontend team has balanced skill distribution with 92% efficiency',
      priority: 'info',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Resource Allocation Issue',
      description: 'Backend team is understaffed by 2 developers for current workload',
      priority: 'medium',
    },
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Tech Stack Aligned',
      description: 'Current technology choices match 94% of project requirements',
      priority: 'info',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStage(0);
      setProgress(0);
      return;
    }

    if (stage < stages.length) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, stages[stage].time);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const increment = 100 / (stages[stage].time / 50);
          return prev + increment > 100 ? 100 : prev + increment;
        });
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, stage]);

  useEffect(() => {
    if (stage < stages.length) {
      setProgress(0);
    }
  }, [stage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-400/30">
                <Brain className="size-6 text-blue-200" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Analysis in Progress</h3>
                <p className="text-sm text-blue-200">Powered by BERT NLP & Advanced Analytics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-card/10 rounded-lg"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {stage < stages.length ? (
            // Loading State
            <div className="space-y-6">
              {stages.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === stage;
                const isComplete = idx < stage;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : isComplete
                        ? 'bg-emerald-50 border border-emerald-500/30'
                        : 'bg-secondary border border-border opacity-50'
                    }`}
                  >
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isComplete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-muted-foreground'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="size-6" />
                      ) : isActive ? (
                        <Loader2 className="size-6 animate-spin" />
                      ) : (
                        <Icon className="size-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{s.label}</p>
                      {isActive && (
                        <div className="mt-2 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                      {isComplete && (
                        <p className="text-sm text-emerald-600 mt-1">Completed</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Results State
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center pb-4 border-b border-border">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-400 px-4 py-2 rounded-full mb-3">
                  <CheckCircle2 className="size-5" />
                  <span className="font-medium">Analysis Complete</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Found {findings.length} Key Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on Jira issues, GitHub commits, and team data
                </p>
              </div>

              <div className="space-y-3">
                {findings.map((finding, idx) => {
                  const Icon = finding.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 ${
                        finding.type === 'warning'
                          ? 'bg-amber-50/50 border-amber-500/30'
                          : 'bg-emerald-50/50 border-emerald-500/30'
                      } animate-in slide-in-from-left duration-300`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            finding.type === 'warning'
                              ? 'bg-amber-500/20 text-amber-600'
                              : 'bg-emerald-500/20 text-emerald-600'
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-foreground">{finding.title}</h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                finding.priority === 'high'
                                  ? 'bg-rose-100 text-rose-700'
                                  : finding.priority === 'medium'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-primary/20 text-primary'
                              }`}
                            >
                              {finding.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {finding.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onViewDetails}
                  className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  View Detailed Report
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-border text-slate-700 hover:bg-secondary transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

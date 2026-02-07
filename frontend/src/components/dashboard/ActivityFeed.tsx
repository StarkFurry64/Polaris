import { GitBranch, GitPullRequest, AlertTriangle, Lightbulb, CheckCircle, Clock } from 'lucide-react';

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'Analysis Complete',
      description: 'GitHub repository scan finished',
      time: '2 min ago',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      type: 'insight',
      icon: Lightbulb,
      title: 'New Recommendation',
      description: 'Consider adding TypeScript expertise',
      time: '15 min ago',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 3,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Skill Gap Detected',
      description: 'ML/AI capability below threshold',
      time: '1 hour ago',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      id: 4,
      type: 'info',
      icon: GitPullRequest,
      title: 'Jira Sync Complete',
      description: '156 issues analyzed and categorized',
      time: '2 hours ago',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 5,
      type: 'info',
      icon: GitBranch,
      title: 'Repository Updated',
      description: 'New commits detected in main branch',
      time: '3 hours ago',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      id: 6,
      type: 'pending',
      icon: Clock,
      title: 'Scheduled Analysis',
      description: 'Weekly team performance review',
      time: 'Tomorrow',
      color: 'text-slate-600 bg-slate-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Activity Feed</h3>
        <p className="text-sm text-slate-600 mt-1">Recent system events</p>
      </div>

      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className={`${activity.color} size-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="size-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 text-sm mb-0.5">
                  {activity.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

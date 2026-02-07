import { Sparkles, GitPullRequest, UserCircle, Brain, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const navItems = [
    { id: 'executive', label: 'Executive', icon: Building2 },
    { id: 'prs', label: 'PRs', icon: GitPullRequest },
    { id: 'developers', label: 'Developers', icon: UserCircle },
    { id: 'ai', label: 'AI Insights', icon: Brain },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Polaris</h1>
              <p className="text-xs text-slate-500">Enterprise Intelligence</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${activeTab === item.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

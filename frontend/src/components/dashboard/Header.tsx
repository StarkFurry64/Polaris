import { Sparkles, Lightbulb, UserCircle, Brain, Building2, FolderKanban } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const navItems = [
    { id: 'executive', label: 'Executive', icon: Building2 },
    { id: 'prs', label: 'Insights', icon: Lightbulb },
    { id: 'developers', label: 'Developers', icon: UserCircle },
    { id: 'jira', label: 'Jira', icon: FolderKanban },
    { id: 'ai', label: 'AI Insights', icon: Brain },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-purple p-2 rounded-xl shadow-purple">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Polaris</h1>
              <p className="text-xs text-muted-foreground">Enterprise Intelligence</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-secondary/50 rounded-full p-1 backdrop-blur-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${isActive
                      ? 'bg-gradient-purple text-white shadow-lg shadow-purple/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <div className="size-2 bg-emerald-500 rounded-full pulse-dot" />
              <span className="font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

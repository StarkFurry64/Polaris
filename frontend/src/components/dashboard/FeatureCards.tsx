import { Target, Users2, LineChart, Layers, ArrowUpRight } from 'lucide-react';

interface FeatureCardsProps {
  onGenerateAnalysis: () => void;
}

export function FeatureCards({ onGenerateAnalysis }: FeatureCardsProps) {
  const features = [
    {
      id: 1,
      icon: Target,
      title: 'Skill Gap Analysis',
      description: 'Identify missing capabilities and expertise in your teams',
      color: 'from-rose-500 to-orange-500',
      stats: { label: '12 Gaps Found', value: '+3 this week' },
    },
    {
      id: 2,
      icon: Users2,
      title: 'Resource Optimization',
      description: 'Smart allocation recommendations for maximum efficiency',
      color: 'from-blue-500 to-cyan-500',
      stats: { label: '89% Efficiency', value: '+12% improvement' },
    },
    {
      id: 3,
      icon: LineChart,
      title: 'Predictive Analytics',
      description: 'Validate solutions with AI-powered forecasting',
      color: 'from-violet-500 to-purple-500',
      stats: { label: '94% Accuracy', value: '23 predictions' },
    },
    {
      id: 4,
      icon: Layers,
      title: 'Tech Stack Advisor',
      description: 'Get recommendations based on project requirements',
      color: 'from-emerald-500 to-teal-500',
      stats: { label: '5 Suggestions', value: 'Updated today' },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.id}
            onClick={onGenerateAnalysis}
            className="group relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/60 hover:border-slate-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform`}>
                <Icon className="size-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 flex items-center justify-between">
                {feature.title}
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="flex items-baseline justify-between pt-4 border-t border-border/50">
                <span className="text-sm font-semibold text-foreground">
                  {feature.stats.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {feature.stats.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

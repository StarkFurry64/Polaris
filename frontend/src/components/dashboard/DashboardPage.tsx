import { FeatureCards } from './FeatureCards';
import { InsightsPanel } from './InsightsPanel';
import { ActivityFeed } from './ActivityFeed';

interface DashboardPageProps {
  onGenerateAnalysis: () => void;
}

export function DashboardPage({ onGenerateAnalysis }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <FeatureCards onGenerateAnalysis={onGenerateAnalysis} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightsPanel />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

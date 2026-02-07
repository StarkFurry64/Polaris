import { Brain, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGenerateAnalysis: () => void;
}

export function Hero({ onGenerateAnalysis }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      
      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-400/30">
          <Brain className="size-4" />
          <span>Powered by AI & Advanced Analytics</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Transform Your Business
          <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            with Intelligent Insights
          </span>
        </h2>
        
        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
          Leverage Jira integration, BERT NLP analysis, and GitHub repository insights 
          to identify gaps, optimize teams, and make data-driven decisions with confidence.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onGenerateAnalysis}
            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg shadow-white/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            Generate Analysis
            <ArrowRight className="size-4" />
          </button>
          <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import {
  Target,
  Users,
  TrendingUp,
  Code,
  Brain,
  GitBranch,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "DORA Metrics",
    description: "Track the four key metrics that define elite engineering teams: Deployment Frequency, Lead Time, MTTR, and Change Failure Rate.",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    metrics: ["Elite rating achieved", "4 metrics tracked"],
  },
  {
    icon: GitBranch,
    title: "PR Cycle Time",
    description: "Analyze pull request lifecycle from creation to merge. Identify bottlenecks in code review and optimize your delivery pipeline.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-600",
    metrics: ["18.5h avg cycle time", "-12% this week"],
  },
  {
    icon: Users,
    title: "Developer Metrics",
    description: "Understand individual and team contributions. Track commits, reviews, and collaboration patterns without surveillance.",
    color: "from-violet-500 to-violet-600",
    bgColor: "bg-violet-500/10",
    iconColor: "text-violet-600",
    metrics: ["23 developers", "94% active"],
  },
  {
    icon: TrendingUp,
    title: "Bottleneck Detection",
    description: "Automatically identify where work is getting stuck. Get alerts for stale PRs, blocked pipelines, and long review queues.",
    color: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-500/10",
    iconColor: "text-rose-600",
    metrics: ["3 bottlenecks found", "2 auto-resolved"],
  },
  {
    icon: Brain,
    title: "Workflow Automation",
    description: "gitStream-powered automation for PRs. Auto-assign reviewers, auto-merge safe changes, and enforce quality gates.",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-600",
    metrics: ["4 active rules", "143 executions"],
  },
  {
    icon: Code,
    title: "Real-time Alerts",
    description: "Get notified when metrics drop below thresholds. Connect to Slack, email, or webhooks for instant awareness.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-600",
    metrics: ["3 active alerts", "Slack connected"],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need for{" "}
            <span className="text-gradient-primary">intelligent optimization</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform provides comprehensive insights across multiple dimensions
            to help you make data-driven decisions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-card"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-5`}>
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Metrics */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {feature.metrics.map((metric, i) => (
                  <span key={i} className="text-sm text-muted-foreground">
                    {metric}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

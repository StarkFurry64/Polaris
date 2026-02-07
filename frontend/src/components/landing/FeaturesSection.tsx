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
    title: "Skill Gap Analysis",
    description: "Identify missing capabilities by analyzing ticket complexity vs. team expertise. Get actionable insights on where to invest in training or hiring.",
    color: "from-polaris-coral to-polaris-coral/70",
    bgColor: "bg-polaris-coral/10",
    iconColor: "text-polaris-coral",
    metrics: ["12 gaps identified", "+3 this week"],
  },
  {
    icon: Users,
    title: "Resource Optimization",
    description: "Smart allocation recommendations for maximum efficiency. Detect over-allocated resources and single points of failure in your teams.",
    color: "from-polaris-purple to-polaris-purple/70",
    bgColor: "bg-polaris-purple/10",
    iconColor: "text-polaris-purple",
    metrics: ["89% efficiency", "+12% improvement"],
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Validate solutions with AI-powered forecasting. Simulate impact of proposed changes before committing resources.",
    color: "from-polaris-green to-polaris-green/70",
    bgColor: "bg-polaris-green/10",
    iconColor: "text-polaris-green",
    metrics: ["94% accuracy", "23 predictions"],
  },
  {
    icon: Code,
    title: "Tech Stack Advisor",
    description: "Get technology recommendations based on your project requirements, team capabilities, and industry best practices.",
    color: "from-polaris-teal to-polaris-teal/70",
    bgColor: "bg-polaris-teal/10",
    iconColor: "text-polaris-teal",
    metrics: ["5 suggestions", "Updated today"],
  },
  {
    icon: Brain,
    title: "BERT NLP Processing",
    description: "Advanced natural language processing to understand context, sentiment, and patterns in tickets and documentation.",
    color: "from-polaris-blue to-polaris-blue/70",
    bgColor: "bg-polaris-blue/10",
    iconColor: "text-polaris-blue",
    metrics: ["10K+ tickets analyzed", "Real-time processing"],
  },
  {
    icon: GitBranch,
    title: "Repository Analysis",
    description: "Analyze commit patterns, code contributions, and development activity to understand team productivity and code quality.",
    color: "from-polaris-orange to-polaris-orange/70",
    bgColor: "bg-polaris-orange/10",
    iconColor: "text-polaris-orange",
    metrics: ["GitHub integrated", "50+ repos supported"],
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

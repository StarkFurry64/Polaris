import { motion } from "framer-motion";
import { Database, Brain, LineChart, Lightbulb } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Data Collection",
    description: "Connect your Jira and GitHub accounts. We securely sync your project data, tickets, sprint metrics, and repository activity.",
    color: "text-polaris-teal",
    bgColor: "bg-polaris-teal/10",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Processing",
    description: "Our BERT NLP models analyze your data to understand context, sentiment, and patterns across all your projects.",
    color: "text-polaris-purple",
    bgColor: "bg-polaris-purple/10",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Insights Generation",
    description: "The analytics engine aggregates data and identifies skill gaps, bottlenecks, and optimization opportunities.",
    color: "text-polaris-green",
    bgColor: "bg-polaris-green/10",
  },
  {
    number: "04",
    icon: Lightbulb,
    title: "Actionable Recommendations",
    description: "Receive prioritized recommendations with confidence scores and impact simulations for each proposed solution.",
    color: "text-polaris-coral",
    bgColor: "bg-polaris-coral/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 bg-secondary/30">
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
            How <span className="text-gradient-primary">Polaris</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Our four-stage analytical pipeline transforms raw data into actionable business intelligence.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connection Line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-polaris-teal via-polaris-purple via-polaris-green to-polaris-coral hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`inline-block p-6 rounded-2xl border border-border bg-card ${
                    index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  }`}>
                    <div className={`flex items-center gap-3 mb-3 ${
                      index % 2 === 0 ? "md:justify-end" : ""
                    }`}>
                      <span className={`text-sm font-bold ${step.color}`}>{step.number}</span>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground max-w-md">{step.description}</p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl ${step.bgColor} border-4 border-background`}>
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

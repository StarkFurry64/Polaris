import { motion } from "framer-motion";
import { GitBranch, Trello, CheckCircle } from "lucide-react";

const integrations = [
  {
    name: "Jira",
    description: "Extract project data, ticket histories, sprint metrics, and team assignments",
    icon: Trello,
    features: ["Ticket Analysis", "Sprint Metrics", "Team Assignments", "Workflow Tracking"],
  },
  {
    name: "GitHub",
    description: "Analyze commit patterns, code contributions, technology stack, and development activity",
    icon: GitBranch,
    features: ["Commit Analysis", "PR Reviews", "Tech Stack Detection", "Contributor Insights"],
  },
];

const IntegrationsSection = () => {
  return (
    <section id="integrations" className="relative py-24 bg-background">
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
            Seamless <span className="text-gradient-primary">Integrations</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect your existing tools and start getting insights in minutes.
          </p>
        </motion.div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                  <integration.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">Official Integration</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{integration.description}</p>
              
              <div className="space-y-3">
                {integration.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-polaris-green" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;

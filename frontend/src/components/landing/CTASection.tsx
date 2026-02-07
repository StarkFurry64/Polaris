import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background - Blue gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/30 bg-white/20 text-white">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Start optimizing today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your{" "}
            <span className="text-white/90">business intelligence?</span>
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join forward-thinking teams using Polaris to identify skill gaps, 
            optimize resources, and make data-driven decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-[#6edeff] to-cyan-400 text-[#111d3b] hover:from-cyan-400 hover:to-[#6edeff] gap-2 px-8 font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-[#6edeff]/50 text-[#6edeff] hover:bg-[#6edeff]/10 hover:border-[#6edeff] gap-2 px-8 font-semibold backdrop-blur-sm transition-all">
              Schedule Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/70">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

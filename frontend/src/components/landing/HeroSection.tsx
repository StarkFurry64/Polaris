import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background - Blue gradient hero */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), 
                           linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/30 bg-white/20 text-white"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by AI & Advanced Analytics</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Software Delivery</span>
            <br />
            <span className="text-white/90">Intelligence Platform</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Measure DORA metrics, optimize PR cycle time, detect bottlenecks, and automate
            your engineering workflows with AI-powered insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-[#6edeff] to-cyan-400 text-[#111d3b] hover:from-cyan-400 hover:to-[#6edeff] gap-2 px-8 font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-[#6edeff]/50 text-[#6edeff] hover:bg-[#6edeff]/10 hover:border-[#6edeff] gap-2 px-8 font-semibold backdrop-blur-sm transition-all">
              View Demo
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto"
        >
          {[
            { icon: TrendingUp, label: "DORA Metrics", value: "Elite Rating", subtext: "4 metrics tracked", iconBg: "from-emerald-500 to-green-600", subtextColor: "text-emerald-400" },
            { icon: Code, label: "PR Cycle Time", value: "18.5 hours", subtext: "-12% this week", iconBg: "from-blue-500 to-cyan-600", subtextColor: "text-blue-400" },
            { icon: Users, label: "Team Velocity", value: "94% Efficiency", subtext: "+8% improvement", iconBg: "from-violet-500 to-purple-600", subtextColor: "text-violet-400" },
            { icon: TrendingUp, label: "Bottlenecks", value: "3 Detected", subtext: "Auto-resolved: 2", iconBg: "from-[#6edeff] to-cyan-500", subtextColor: "text-[#6edeff]" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-[#6edeff]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#6edeff]/10"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} mb-4 shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white/90 mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className={`text-sm ${stat.subtextColor}`}>{stat.subtext}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

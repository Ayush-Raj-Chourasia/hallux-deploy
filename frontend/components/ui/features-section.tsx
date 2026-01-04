"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Brain, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Real-time Verification",
    description: "<3s Avg Speed. Get instant results. No waiting, no delays.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Search,
    title: "5-Layer Analysis",
    description: "5 Layers of verification including URL validation, metadata check, and AI scoring.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "98% Accuracy Rate. Get detailed explanations and confidence scores.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: CheckCircle2,
    title: "Multi-Format Support",
    description: "Works with text, PDFs, DOIs, arXiv IDs, and URLs seamlessly.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section id="features" className="relative py-24 px-4 bg-[#030303] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300">
              Why Choose Hallux?
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            The most comprehensive citation verification system, powered by cutting-edge AI
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
                {/* Icon Container */}
                <div className={cn(
                  "inline-flex p-3 rounded-xl mb-4",
                  "bg-gradient-to-br",
                  feature.gradient,
                  "border border-white/[0.1]"
                )}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/[0.05] to-rose-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

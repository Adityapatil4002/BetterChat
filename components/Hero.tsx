"use client";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-secondary mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          v1.0 System Operational
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-6"
        >
          BetterChat.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The intelligent command center for your team. Real-time messaging meets proactive AI agents.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            View System Architecture
          </button>
        </motion.div>
      </div>
    </section>
  );
}
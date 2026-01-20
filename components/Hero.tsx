"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Shield, Boxes, Cpu } from "lucide-react";
import { useRef } from "react";

// Animation variants for staggered text reveal
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Background Node Component
function Node({
  x,
  y,
  label,
  icon: Icon,
  delay,
}: {
  x: string;
  y: string;
  label: string;
  icon: any;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: delay, ease: "easeOut" }}
      className="absolute flex flex-col items-center gap-2 z-10 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-surface border border-border/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
        <Icon className="w-5 h-5 text-accent" />
        {/* Connecting Lines (Simplified for visual effect) */}
        <div className="absolute top-1/2 left-full w-32 h-[1px] bg-gradient-to-r from-accent/50 to-transparent -z-10 origin-left rotate-12 scale-x-0 animate-[grow-line_2s_ease-out_forwards]" style={{ animationDelay: `${delay + 0.5}s` }}></div>
      </div>
      <span className="text-xs text-secondary font-medium tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* === Background Elements === */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        {/* Main Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] bg-accent/10 rounded-full blur-[150px] animate-glow-pulse" />
        
        {/* Secondary Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Background Grid/Texture */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </motion.div>

      {/* Floating Nodes from Inspiration */}
      <Node x="15%" y="25%" label="Cortex AI" icon={Cpu} delay={1.2} />
      <Node x="80%" y="30%" label="Quant Process" icon={Boxes} delay={1.4} />
      <Node x="10%" y="65%" label="Secure Link" icon={Shield} delay={1.6} />

      {/* === Main Content === */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-10vh]"
      >
        {/* Top Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-sm text-accent backdrop-blur-sm cursor-pointer hover:bg-accent/10 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Intelligent Command Center
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            One-click for
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-white animate-pulse-slow">
            Team Efficiency
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transform your chat into a proactive workflow engine. Where real-time messaging meets autonomous AI agents.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">Open App</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg flex items-center gap-3 backdrop-blur-sm transition-colors"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Demo
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-10 flex items-center gap-4 text-secondary text-sm font-medium"
      >
        <div className="h-12 w-8 rounded-full border border-border/50 flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-accent rounded-full"
          />
        </div>
        01 / 03 . Scroll down
      </motion.div>
    </section>
  );
}
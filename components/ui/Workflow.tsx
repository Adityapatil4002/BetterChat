"use client";

import React, { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { 
  Bot, 
  CheckCircle2, 
  Terminal, 
  Zap, 
  ChevronRight,
  Globe,
  ShieldCheck,
  TrendingUp,
  Box
} from "lucide-react";

/* ==================================================================================
   SUB-COMPONENT: APP INTERFACE (The Feature Animation)
   ================================================================================== */
const AppInterface = () => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className="w-full max-w-5xl relative z-10"
  >
    {/* Glow Effect behind the box */}
    <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-xl opacity-20" />
    
    {/* The Card */}
    <div className="relative bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Window Header */}
      <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
        </div>
        <div className="text-[10px] font-mono text-zinc-600">AI Context Analysis</div>
      </div>

      {/* Window Content */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left: AI Message Bubble */}
        <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl p-6 relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center">
             <Bot className="w-4 h-4 text-white" />
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-light">
            I've analyzed the <span className="text-white font-medium">search-algorithm.ts</span> file. The current implementation has O(n²) complexity. I recommend refactoring to a hash map approach for O(1) lookups.
          </p>
          <div className="space-y-2 text-sm text-zinc-500 font-mono bg-black/50 p-3 rounded-lg border border-white/5">
            <div className="flex gap-2"><span className="text-zinc-700">1</span> <span className="text-red-400">- const find = (arr, target) ={'>'} ...</span></div>
            <div className="flex gap-2"><span className="text-zinc-700">2</span> <span className="text-green-400">+ const map = new Map(arr.map...</span></div>
          </div>
          <div className="flex gap-3 pt-4 mt-4 border-t border-white/5">
             <button className="text-xs flex items-center gap-2 px-3 py-1.5 rounded-md bg-white text-black font-semibold hover:bg-zinc-200 transition-colors">
                <CheckCircle2 size={12} /> Apply Fix
             </button>
          </div>
        </div>

        {/* Right: File Status */}
        <div className="w-full md:w-64 bg-[#0A0A0A] rounded-lg border border-white/5 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-medium text-zinc-500">System Check</span>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Passing</span>
          </div>
          
          {[1, 2, 3].map((_, i) => (
             <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full bg-zinc-500"
                   />
                </div>
             </div>
          ))}
          
          <div className="mt-auto pt-2">
             <div className="text-[10px] text-zinc-600 font-mono">Lat: 14ms | Tps: 840</div>
          </div>
        </div>

      </div>
    </div>
  </motion.div>
);

/* ==================================================================================
   MAIN COMPONENT
   ================================================================================== */

export default function Workflow() {
  
  // Mouse tracking logic for Avatar
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the avatar follow effect
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    mouseX.set((e.clientX - centerX) / 10);
    mouseY.set((e.clientY - centerY) / 10);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-32 px-4 md:px-6 bg-black text-white overflow-hidden flex flex-col items-center"
    >
      
      {/* 1. TOP SECTION: HEADING & 3D AVATAR */}
      <div className="relative z-20 flex flex-col items-center justify-center mb-16 max-w-3xl mx-auto text-center">
        
        {/* 3D Magnetic Avatar */}
        <motion.div 
          style={{ x: springX, y: springY, rotateX: springY, rotateY: springX }}
          className="relative mb-10 group perspective-1000"
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          
          {/* The 3D Object */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-zinc-800 to-[#050505] rounded-3xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] transform-style-3d transition-transform">
             {/* Inner Highlight */}
             <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
             <Bot className="w-10 h-10 text-white relative z-10" />
             
             {/* Floating Elements (Eyes/Sensors) */}
             <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-0 w-8 h-8 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md"
             >
                <Terminal size={14} className="text-zinc-400" />
             </motion.div>
             <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 bottom-0 w-8 h-8 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-md"
             >
                <Zap size={14} className="text-white" />
             </motion.div>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          Accelerate your entire <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">development workflow.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-zinc-400 max-w-lg leading-relaxed"
        >
           AI-driven automation that adapts to your codebase. Build, test, and deploy faster than ever before.
        </motion.p>
      </div>


      {/* 2. MIDDLE SECTION: APP INTERFACE (Feature Animation) */}
      <div className="mb-32 w-full flex justify-center">
         <AppInterface />
      </div>


      {/* 3. BOTTOM SECTION: 4-GRID LAYOUT (Bento Grid) */}
      <div className="w-full max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* ROW 1 LEFT (65% width -> approx 8 cols) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="md:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-white/10 transition-colors" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
                    Your AI partner everywhere.
                </h3>
                <p className="text-zinc-400 text-lg mb-8 max-w-lg relative z-10">
                    BetterChat is ready to work with you at each step of the software development lifecycle, from prompt to production.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all relative z-10">
                    Explore Integration <ChevronRight size={16} />
                </a>
            </motion.div>


            {/* ROW 1 RIGHT (35% width -> approx 4 cols) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="md:col-span-4 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-colors"
            >
                 <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Box className="text-white fill-white/20" size={24} />
                        <span className="font-bold text-lg tracking-tight">Acme Corp</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        "BetterChat boosts developer speed by 25% with intelligent context awareness."
                    </p>
                 </div>
                 <a href="#" className="text-sm text-zinc-300 hover:text-white flex items-center gap-1 transition-colors">
                    Read customer story <ChevronRight size={12} />
                 </a>
            </motion.div>


            {/* ROW 2 LEFT (40% width -> approx 5 cols) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="md:col-span-5 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-colors"
            >
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck size={28} className="text-white" />
                        <span className="text-xl font-bold">Security First</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">
                        2026 Enterprise Compliance Report for AI Code Assistants.
                    </p>
                </div>
                <a href="#" className="text-sm text-zinc-300 hover:text-white flex items-center gap-1 transition-colors">
                    Read industry report <ChevronRight size={12} />
                </a>
            </motion.div>


            {/* ROW 2 RIGHT (60% width -> approx 7 cols) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="md:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group"
            >
                <div className="flex-1">
                     <h3 className="text-xl font-bold text-white mb-2">Automate at scale</h3>
                     <p className="text-zinc-400 text-sm mb-6">
                        Ship faster with secure, reliable pipelines that scale from 1 to 100k requests.
                     </p>
                     <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">99.9%</span>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Uptime</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">14ms</span>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Latency</span>
                        </div>
                     </div>
                </div>
                
                {/* Visual Graphic for Grid Item 4 */}
                <div className="relative w-full md:w-1/2 h-32 bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                    <Globe className="text-zinc-700 w-full h-full opacity-20 scale-150 absolute" />
                    <div className="relative z-10 flex items-center gap-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-zinc-300">System Operational</span>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>

    </section>
  );
}
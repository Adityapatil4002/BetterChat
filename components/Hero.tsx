"use client";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, ScanEye, ShieldCheck, User, Zap } from "lucide-react";

/* ===================== NAVBAR ===================== */
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 w-full px-6 py-6 z-50 pointer-events-none"
    >
      <div className="absolute left-6 top-6 pointer-events-auto text-lg font-semibold text-white">
        BetterChat
      </div>

      <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto hidden md:flex items-center bg-[#111]/80 border border-white/10 backdrop-blur-xl rounded-full px-2 py-2">
        <div className="flex items-center gap-6 px-6 text-xs text-gray-400">
          <a className="text-white cursor-pointer hover:text-white transition-colors">Product</a>
          <a className="text-white cursor-pointer hover:text-white transition-colors">Flow</a>
          <a className="text-white cursor-pointer hover:text-white transition-colors">Integrations</a>
          <a className="text-white cursor-pointer hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <button className="px-3 py-1.5 text-[10px] bg-white/5 rounded-full flex items-center gap-1 hover:bg-white/10 transition-colors">
             System Active <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"/>
          </button>
        </div>
      </div>

      <div className="absolute right-6 top-6 pointer-events-auto flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity">
        <User className="w-5 h-5 text-gray-300" />
        <span className="hidden sm:inline text-sm">Sign In</span>
      </div>
    </motion.nav>
  );
}

/* ===================== BACKGROUND ===================== */
function Background() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/5 blur-[100px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
    </div>
  );
}

/* ===================== DUAL SIDE FLOW SYSTEM ===================== */
function DualFlowSystem() {
  
  // Node Configuration (Updated with requested Features)
  const nodes = [
    // --- Left Side ---
    { 
      id: 0, label: "Real-time & Groups", sub: "Instant Sync", icon: Zap, color: "text-amber-400", 
      pos: "top-[25%] left-[10%] md:left-[15%]", side: "left", delay: 0
    },
    { 
      id: 1, label: "Intent Detection", sub: "Context Aware", icon: ScanEye, color: "text-purple-400", 
      pos: "bottom-[25%] left-[10%] md:left-[15%]", side: "left", delay: 0.5
    },
    // --- Right Side ---
    { 
      id: 2, label: "AI Integrations", sub: "Model Agnostic", icon: BrainCircuit, color: "text-blue-400", 
      pos: "top-[25%] right-[10%] md:right-[15%]", side: "right", delay: 1.0
    },
    { 
      id: 3, label: "Security", sub: "End-to-End Encrypted", icon: ShieldCheck, color: "text-emerald-400", 
      pos: "bottom-[25%] right-[10%] md:right-[15%]", side: "right", delay: 1.5
    },
  ];

  // SVG Paths - Sharp L Shapes
  const paths = {
      "left-top": "M 150 150 L 300 150 L 450 300",
      "left-bottom": "M 150 450 L 300 450 L 450 300",
      "right-top": "M 850 150 L 700 150 L 550 300",
      "right-bottom": "M 850 450 L 700 450 L 550 300",
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      
      {/* 1. SVG Layer for Flow Lines */}
      {/* Mask ensures lines fade out completely before hitting center text */}
      <svg className="absolute inset-0 w-full h-full overflow-visible [mask-image:radial-gradient(circle_at_center,transparent_150px,black_350px)]" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Static Line Gradients (Fading out near center) */}
            <linearGradient id="static-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="80%" stopColor="rgba(255,255,255,0)" /> 
            </linearGradient>
            <linearGradient id="static-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="20%" stopColor="rgba(255,255,255,0)" />    
              <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
            </linearGradient>
          </defs>
          
          {nodes.map((node, i) => {
              const pathKey = `${node.side}-${node.pos.includes('top') ? 'top' : 'bottom'}`;
              // @ts-ignore
              const d = paths[pathKey];
              const staticStrokeUrl = node.side === 'left' ? "url(#static-grad-left)" : "url(#static-grad-right)";

              return (
                <g key={`path-${i}`}>
                    {/* Static Background Path */}
                    <path d={d} stroke={staticStrokeUrl} strokeWidth="1" fill="none" />
                    
                    {/* Animated Moving Path */}
                    <motion.path 
                        d={d}
                        stroke="url(#flow-grad)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="100 400"
                        initial={{ strokeDashoffset: 500 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ 
                            duration: 3, 
                            ease: "linear", 
                            repeat: Infinity,
                            delay: node.delay 
                        }}
                    />
                </g>
              )
          })}
      </svg>

      {/* 2. The 4 Feature Nodes (HTML Cards at start of lines) */}
      {nodes.map((node, index) => {
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: node.side === 'left' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
            animate={ active => ({ y: [0, -10, 0] })}
            transition={ active => ({ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 })}
            className={`absolute ${node.pos} flex flex-col items-center gap-4 z-20 -translate-y-1/2`}
          >
              <div className="w-16 h-16 rounded-none border border-white/10 bg-black/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)] relative overflow-hidden group">
                  <node.icon className={`w-7 h-7 ${node.color} relative z-10`} />
                  <div className={`absolute inset-0 opacity-20 bg-${node.color.split('-')[1]}-500/30 blur-xl group-hover:opacity-40 transition-opacity`}/>
              </div>

              <div className="text-center">
                <div className="text-sm font-bold text-white whitespace-nowrap">{node.label}</div>
                <div className={`text-[10px] uppercase tracking-wider ${node.color} opacity-70`}>
                    {node.sub}
                </div>
              </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ===================== HERO MAIN ===================== */
export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden selection:bg-white/20">
      <Background />
      <Navbar />

      <DualFlowSystem />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* CENTER CONTENT */}
      <div className="relative z-30 text-center max-w-xl px-4">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-white/10 bg-black/40 backdrop-blur-md rounded-none px-4 py-1.5 mb-8"
        >
          <Bot className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-[11px] text-gray-300 tracking-wide uppercase font-semibold">
            Latency: 14ms
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.9]"
        >
          From Prompt <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-600">
            to Reality.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-10"
        >
          The first chat interface that doesn't just talk—it executes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center gap-5"
        >
          <button className="h-12 px-8 rounded-none bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]">
            Start Flow <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

    </section>
  );
}
"use client";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, MessageSquare, ScanEye, ShieldCheck, User } from "lucide-react";

/* ===================== NAVBAR ===================== */
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 w-full px-6 py-6 z-50 pointer-events-none"
    >
      <div className="absolute left-6 top-6 pointer-events-auto text-xl font-bold tracking-tight text-white">
        BetterChat
      </div>

      <div className="absolute left-1/2 top-6 -translate-x-1/2 pointer-events-auto hidden md:flex items-center bg-[#0A0A0A]/90 border border-white/10 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl">
        <div className="flex items-center gap-6 px-6 text-xs font-medium text-gray-400">
          <a className="text-white cursor-pointer hover:text-gray-300 transition-colors">Product</a>
          <a className="text-white cursor-pointer hover:text-gray-300 transition-colors">Flow</a>
          <a className="text-white cursor-pointer hover:text-gray-300 transition-colors">Integrations</a>
          <a className="text-white cursor-pointer hover:text-gray-300 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <button className="px-3 py-1.5 text-[10px] font-semibold bg-white/5 rounded-full flex items-center gap-1.5 hover:bg-white/10 transition-colors border border-white/5 text-gray-300">
             System Active <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"/>
          </button>
        </div>
      </div>

      <div className="absolute right-6 top-6 pointer-events-auto flex items-center gap-4 text-white cursor-pointer hover:opacity-80 transition-opacity">
        <span className="hidden sm:inline text-xs font-medium text-gray-300 hover:text-white transition-colors">Sign In</span>
      </div>
    </motion.nav>
  );
}

/* ===================== BACKGROUND ===================== */
function Background() {
  return (
    <div className="absolute inset-0 bg-[#000000] overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-950/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-950/10 blur-[100px] rounded-full" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
    </div>
  );
}

/* ===================== DUAL SIDE FLOW SYSTEM ===================== */
function DualFlowSystem() {
  
  // LOGIC:
  // We define a fixed coordinate space (1200x600) to ensure perfect alignment.
  // The cards are positioned via absolute pixels within this container to match SVG path start points.

  const nodes = [
    // LEFT SIDE
    { 
      id: 0, label: "Core Messaging", sub: "REAL-TIME & GROUPS", icon: MessageSquare, color: "text-white", 
      align: "left", x: 1, y: 100, delay: 0 
    },
    { 
      id: 1, label: "Intent Detection", sub: "CONTEXT AWARE", icon: ScanEye, color: "text-purple-400", 
      align: "left", x: 1, y: 420, delay: 0.5 
    },
    // RIGHT SIDE
    { 
      id: 2, label: "Integrations", sub: "APP ECOSYSTEM", icon: BrainCircuit, color: "text-blue-400", 
      align: "right", x: 1, y: 100, delay: 1.0 
    },
    { 
      id: 3, label: "Security", sub: "END-TO-END ENCRYPTED", icon: ShieldCheck, color: "text-emerald-400", 
      align: "right", x: 1, y: 420, delay: 1.5 
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      
      {/* Container: 1200px wide, 600px tall. Responsive scaling. */}
      <div className="w-full max-w-[1200px] h-[600px] relative">
      
        {/* 1. SVG LINES */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1200 600">
            <defs>
              <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="static-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" /> 
              </linearGradient>
            </defs>
            
            {/* 
               PATHS LOGIC:
               - Left Cards are approx 260px wide. Line starts at X=260.
               - Right Cards starts at X=940 (1200-260).
               - Y positions match the node.y values exactly (140 and 460).
            */}

            {/* Left Top */}
            <g>
                <path d="M 260 140 L 380 140 L 500 240" stroke="url(#static-grad)" strokeWidth="1" fill="none" />
                <motion.path d="M 260 140 L 380 140 L 500 240" stroke="url(#flow-grad)" strokeWidth="1.5" fill="none" strokeDasharray="100 600"
                    initial={{ strokeDashoffset: 700 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: 0 }} />
                {/* Connection Dot */}
                <circle cx="260" cy="140" r="2" fill="white" fillOpacity="0.3" />
            </g>

            {/* Left Bottom */}
            <g>
                <path d="M 260 460 L 380 460 L 500 360" stroke="url(#static-grad)" strokeWidth="1" fill="none" />
                <motion.path d="M 260 460 L 380 460 L 500 360" stroke="url(#flow-grad)" strokeWidth="1.5" fill="none" strokeDasharray="100 600"
                    initial={{ strokeDashoffset: 700 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: 0.5 }} />
                <circle cx="260" cy="460" r="2" fill="white" fillOpacity="0.3" />
            </g>

            {/* Right Top */}
            <g>
                <path d="M 940 140 L 820 140 L 700 240" stroke="url(#static-grad)" strokeWidth="1" fill="none" />
                <motion.path d="M 940 140 L 820 140 L 700 240" stroke="url(#flow-grad)" strokeWidth="1.5" fill="none" strokeDasharray="100 600"
                    initial={{ strokeDashoffset: 700 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: 1 }} />
                <circle cx="940" cy="140" r="2" fill="white" fillOpacity="0.3" />
            </g>

            {/* Right Bottom */}
            <g>
                <path d="M 940 460 L 820 460 L 700 360" stroke="url(#static-grad)" strokeWidth="1" fill="none" />
                <motion.path d="M 940 460 L 820 460 L 700 360" stroke="url(#flow-grad)" strokeWidth="1.5" fill="none" strokeDasharray="100 600"
                    initial={{ strokeDashoffset: 700 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, ease: "linear", repeat: Infinity, delay: 1.5 }} />
                <circle cx="940" cy="460" r="2" fill="white" fillOpacity="0.3" />
            </g>
        </svg>

        {/* 2. THE CARDS */}
        {nodes.map((node, index) => {
          const isLeft = node.align === 'left';
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              style={{
                top: node.y,
                left: isLeft ? node.x : 'auto',
                right: !isLeft ? node.x : 'auto',
              }}
              className="absolute -translate-y-1/2 z-20"
            >
                {/* 
                    CARD CONTAINER 
                    Width is fixed (w-60 ~ 240px) to ensure line connects to edge perfectly.
                */}
                <div className={`
                  relative w-64 h-20 flex items-center gap-4 p-4
                  bg-[#0A0A0A] border border-white/10 
                  rounded-2xl shadow-2xl shadow-black/50
                  group hover:border-white/20 transition-all duration-300
                  ${isLeft ? 'flex-row pr-2' : 'flex-row-reverse pl-2 text-right'}
                `}>
                    
                    {/* Glowing Backdrop */}
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                    {/* ICON */}
                    <div className={`
                      relative w-12 h-12 rounded-xl bg-white/5 border border-white/5 
                      flex items-center justify-center shrink-0
                      group-hover:bg-white/10 transition-colors
                    `}>
                        <node.icon className={`w-5 h-5 ${node.color}`} />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-semibold text-gray-100 tracking-tight whitespace-nowrap">{node.label}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors whitespace-nowrap">
                          {node.sub}
                      </span>
                    </div>

                    {/* CONNECTOR POINT (Visual Only - overlaps SVG line start) */}
                    <div className={`
                        absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-white/20 bg-[#0A0A0A] z-30
                        ${isLeft ? '-right-1' : '-left-1'}
                    `}>
                        <div className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-white/50" />
                    </div>

                </div>
            </motion.div>
          )
        })}
      </div>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* CENTER CONTENT */}
      <div className="relative z-30 text-center max-w-2xl px-4 flex flex-col items-center">
        
        {/* Latency Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm rounded-full px-3 py-1 mb-8"
        >
          <Bot className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-[11px] text-yellow-200/90 tracking-wide uppercase font-bold">
            Latency: 14ms
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.95]"
        >
          From Prompt <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            to Reality.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-10"
        >
          The first chat interface that doesn't just talk—it executes complex workflows in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <button className="group h-12 px-8 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)]">
            Start Flow 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

    </section>
  );
}
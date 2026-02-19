"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Plus, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Send,
  Search,
  Settings,
  LogOut,
  Hash,
  User,
  LayoutGrid,
  Bot, // From Workflow.tsx
  CheckCircle2, // From Workflow.tsx
  Terminal, // From Workflow.tsx
  ChevronRight, // From Workflow.tsx
  Globe, // From Workflow.tsx
  ShieldCheck, // From Workflow.tsx
  Box // From Workflow.tsx
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility (from Features.tsx) ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types for MockChatUI (from Features.tsx) ---
type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other' | 'system';
  senderName?: string;
  timestamp: string;
};

// --- Animation Script for MockChatUI (from Features.tsx) ---
const SCRIPT_SEQUENCE = [
  // 1. Start in DM
  { type: 'switch', mode: 'dm', name: 'Shivaraj Kolekar', tab: 'friends' },
  { type: 'delay', ms: 300 },
  { type: 'msg', sender: 'me', text: 'Yo, check out this latency! ⚡️' },
  { type: 'delay', ms: 400 },
  { type: 'typing', show: true },
  { type: 'delay', ms: 800 },
  { type: 'typing', show: false },
  { type: 'msg', sender: 'other', text: 'Wait, did that send already?', name: 'Shivaraj' },
  { type: 'delay', ms: 300 },
  { type: 'msg', sender: 'me', text: 'Instant. 14ms global avg.' },
  { type: 'delay', ms: 800 },
  
  // 2. Switch to Group
  { type: 'switch', mode: 'group', name: 'F1 Group', tab: 'groups' },
  { type: 'system', text: 'Shivaraj added you to the group' },
  { type: 'delay', ms: 400 },
  { type: 'msg', sender: 'other', text: 'Guys, the new socket engine is live.', name: 'Alex' },
  { type: 'delay', ms: 200 },
  { type: 'msg', sender: 'other', text: 'Finally! 🚀', name: 'Sarah' },
  { type: 'delay', ms: 400 },
  { type: 'msg', sender: 'me', text: 'Handling 10k concurrents easy.' },
  { type: 'delay', ms: 1500 },
];

// --- SUB-COMPONENT: MockChatUI (from Features.tsx) ---
const MockChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatName, setActiveChatName] = useState('Shivaraj Kolekar');
  const [inputText, setInputText] = useState('');
  
  const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
  const [selectedId, setSelectedId] = useState('shiv'); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    let currentTime = 0;

    const runScript = () => {
      setMessages([]);
      setIsTyping(false);
      
      SCRIPT_SEQUENCE.forEach((step) => {
        if (step.type === 'delay') {
          currentTime += (step.ms || 0);
        } 
        else if (step.type === 'switch') {
          const tid = setTimeout(() => {
            setActiveTab(step.tab as 'friends' | 'groups');
            setActiveChatName(step.name || '');
            setSelectedId(step.mode === 'dm' ? 'shiv' : 'f1');
            setMessages([]);
          }, currentTime);
          timeoutIds.push(tid);
        }
        else if (step.type === 'typing') {
            const tid = setTimeout(() => {
              setIsTyping(step.show || false);
            }, currentTime);
            timeoutIds.push(tid);
        }
        else if (step.type === 'msg' || step.type === 'system') {
          const tid = setTimeout(() => {
            if (step.sender === 'me') {
               setInputText(step.text || '');
               setTimeout(() => {
                 setInputText('');
                 addMessage(step);
               }, 200);
            } else {
              addMessage(step);
            }
          }, currentTime);
          timeoutIds.push(tid);
        }
      });

      const resetTime = setTimeout(runScript, currentTime + 500);
      timeoutIds.push(resetTime);
    };

    const addMessage = (step: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36),
          text: step.text,
          sender: step.sender,
          senderName: step.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        },
      ]);
    };

    runScript();
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-[650px] bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden flex shadow-2xl shadow-black relative font-sans select-none">
      
      {/* --- SIDEBAR --- */}
      <div className="w-[280px] border-r border-white/[0.08] bg-[#0A0A0A] flex flex-col hidden md:flex shrink-0 z-20">
        
        {/* Header & Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                <MessageSquare size={14} className="text-black fill-black" />
             </div>
             <span className="font-bold text-white tracking-tight">BetterChat</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
            <div className="bg-[#151515] border border-white/[0.05] rounded-md flex items-center px-3 py-1.5 gap-2">
                <Search size={14} className="text-zinc-500" />
                <span className="text-xs text-zinc-500">Search friends...</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="px-3 pb-2">
            <div className="bg-[#151515] p-1 rounded-lg flex border border-white/[0.05]">
                <div className={cn(
                    "flex-1 py-1 text-[11px] font-medium text-center rounded-md transition-all duration-300",
                    activeTab === 'friends' ? "bg-[#252525] text-white shadow-sm" : "text-zinc-500"
                )}>
                    Friends
                </div>
                <div className={cn(
                    "flex-1 py-1 text-[11px] font-medium text-center rounded-md transition-all duration-300",
                    activeTab === 'groups' ? "bg-[#252525] text-white shadow-sm" : "text-zinc-500"
                )}>
                    Groups
                </div>
            </div>
        </div>

        {/* Lists Area */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                {activeTab === 'friends' ? 'Online - 4' : 'Your Groups'}
            </div>

            {/* Friend Item (Active) */}
            {activeTab === 'friends' && (
                <>
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-all",
                        selectedId === 'shiv' ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
                    )}>
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">SK</div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">Shivaraj Kolekar</div>
                            <div className="text-[11px] text-zinc-500 truncate">Core Messaging is live</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#151515] opacity-60">
                         <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">AJ</div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-300 truncate">Arjun</div>
                            <div className="text-[11px] text-zinc-600 truncate">Designing...</div>
                        </div>
                    </div>
                </>
            )}

            {/* Group Item (Active) */}
            {activeTab === 'groups' && (
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-md transition-all",
                    selectedId === 'f1' ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
                )}>
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-[#252525] border border-white/5 flex items-center justify-center text-zinc-400">
                             <Hash size={14} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">F1 Group</div>
                        <div className="text-[11px] text-zinc-500 truncate">Active now</div>
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Panel (Settings/Profile) */}
        <div className="mt-auto border-t border-white/[0.08]">
            <div className="p-2 space-y-0.5">
                <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#151515] rounded-md transition-colors cursor-pointer">
                    <LayoutGrid size={16} />
                    <span className="text-xs font-medium">Groups</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#151515] rounded-md transition-colors cursor-pointer">
                     <Users size={16} />
                    <span className="text-xs font-medium">Friends</span>
                </div>
                 <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#151515] rounded-md transition-colors cursor-pointer">
                    <Settings size={16} />
                    <span className="text-xs font-medium">Settings</span>
                </div>
            </div>
            
            <div className="p-3 border-t border-white/[0.08] bg-[#080808]">
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                            <User size={14} className="text-zinc-400" />
                        </div>
                        <div className="text-xs text-white font-medium">User 8002</div>
                     </div>
                     <LogOut size={14} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col bg-[#050505] relative z-10">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#050505]/95 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
                 {/* Dynamic Avatar */}
                 {activeTab === 'friends' ? (
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[10px] font-bold text-white">SK</div>
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-[#252525] border border-white/5 flex items-center justify-center text-zinc-400"><Hash size={14}/></div>
                 )}
                
                <div>
                    <h3 className="text-white font-medium text-sm leading-none mb-0.5">{activeChatName}</h3>
                    <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] text-zinc-500 font-medium">Online</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
                    <Phone size={16} />
                </div>
                 <div className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
                    <Video size={16} />
                </div>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                 <div className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
                    <MoreVertical size={16} />
                </div>
            </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <AnimatePresence initial={false} mode="popLayout">
                {messages.map((msg) => (
                    <motion.div
                        layout
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                            "flex w-full",
                            msg.sender === 'me' ? "justify-end" : 
                            msg.sender === 'system' ? "justify-center" : "justify-start"
                        )}
                    >
                        {msg.sender === 'system' ? (
                            <div className="flex items-center gap-3 w-full my-2">
                                <div className="h-px bg-white/[0.04] flex-1"></div>
                                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
                                    {msg.text}
                                </span>
                                <div className="h-px bg-white/[0.04] flex-1"></div>
                            </div>
                        ) : (
                            <div className={cn(
                                "max-w-[85%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group",
                                msg.sender === 'me' 
                                    ? "bg-white text-black rounded-tr-sm" 
                                    : "bg-[#18181b] text-zinc-200 rounded-tl-sm border border-white/[0.06]"
                            )}>
                                {msg.sender === 'other' && activeTab === 'groups' && (
                                    <p className="text-[10px] font-bold text-white/50 mb-1">{msg.senderName}</p>
                                )}
                                <span className="leading-relaxed">{msg.text}</span>
                                <span className={cn(
                                    "text-[9px] block text-right mt-1 opacity-50 font-medium select-none",
                                    msg.sender === 'me' ? "text-black/60" : "text-zinc-500"
                                )}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
                {isTyping && (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-start"
                    >
                        <div className="bg-[#18181b] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                            <motion.span 
                                animate={{ y: [0, -3, 0] }} 
                                transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                                className="w-1 h-1 bg-zinc-400 rounded-full" 
                            />
                            <motion.span 
                                animate={{ y: [0, -3, 0] }} 
                                transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                className="w-1 h-1 bg-zinc-400 rounded-full" 
                            />
                            <motion.span 
                                animate={{ y: [0, -3, 0] }} 
                                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                                className="w-1 h-1 bg-zinc-400 rounded-full" 
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#050505] border-t border-white/[0.08]">
            <div className="bg-[#121212] border border-white/[0.08] rounded-xl px-2 py-2 flex items-center gap-3 shadow-inner">
                <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
                    <Plus size={20} />
                </div>
                <input 
                    type="text" 
                    readOnly
                    value={inputText}
                    placeholder={`Message ${activeTab === 'groups' ? '#F1 Group' : activeChatName}`}
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600 font-medium"
                />
                <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
                     <Smile size={20} />
                </div>
                <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    inputText ? "bg-white text-black scale-100" : "bg-white/5 text-zinc-600 scale-95"
                )}>
                    <Send size={16} className={inputText ? "fill-black" : ""} />
                </div>
            </div>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-zinc-700">Protected by end-to-end encryption</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CodeContextInterface (from Workflow.tsx) ---
const CodeContextInterface = () => (
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


// --- MAIN FEATURES COMPONENT (Combined) ---
const Features = () => {
  // Mouse tracking logic for Avatar (from Workflow.tsx)
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    mouseX.set((e.clientX - centerX) / 10);
    mouseY.set((e.clientY - centerY) / 10);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-24 px-4 md:px-6 bg-black text-white overflow-hidden flex flex-col items-center"
    >
        {/* Background Elements from old Features.tsx (adjusted to theme) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        {/* 1. TOP SECTION: HEADING & 3D AVATAR (from Workflow.tsx) */}
        <div className="relative z-20 flex flex-col items-center justify-center mb-24 max-w-3xl mx-auto text-center">
            
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

        {/* 2. "APPLICATION INTERFACE" (Code Editor Animation) (from Workflow.tsx) */}
        <div className="mb-24 w-full flex justify-center">
            <CodeContextInterface />
        </div>

        {/* 3. "FEATURE ANIMATION" (MockChatUI) (from Features.tsx) */}
        <div className="w-full max-w-7xl mx-auto mb-24 flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm mb-8"
            >
                <MessageSquare size={14} className="text-white" />
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Core Messaging</span>
            </motion.div>
            
            <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white leading-[0.95] tracking-tight"
                >
                    Real-time. <br />
                    <span className="text-white/40">Zero Latency.</span>
                </motion.h2>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg text-white/50 leading-relaxed font-light"
                >
                    Experience chat that moves as fast as you think. From 1-on-1s to groups of 10,000+, BetterChat delivers messages in <span className="text-white font-medium">under 14ms</span>.
                </motion.p>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full max-w-4xl relative" // Ensure max-width is appropriate for centering
            >
                <MockChatUI />
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 max-w-xl mx-auto" // Added max-w for small cards
            >
                <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors">
                    <Users className="text-zinc-400 mb-3" size={24} /> {/* Adjusted color to grey scale */}
                    <div className="text-2xl font-bold text-white mb-1">Unlimited</div>
                    <div className="text-xs text-white/40 font-medium uppercase tracking-wide">Group Capacity</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors">
                    <Zap className="text-white/50 fill-white/50 mb-3" size={24} /> {/* Adjusted color to grey scale */}
                    <div className="text-2xl font-bold text-white mb-1">14ms</div>
                    <div className="text-xs text-white/40 font-medium uppercase tracking-wide">Global Latency</div>
                </div>
            </motion.div>
        </div>


        {/* 4. BOTTOM SECTION: 4-GRID LAYOUT (Bento Grid) (from Workflow.tsx) */}
        <div className="w-full max-w-6xl mx-auto pt-24">
            
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
};

export default Features;
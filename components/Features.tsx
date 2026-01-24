"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  LayoutGrid
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other' | 'system';
  senderName?: string;
  timestamp: string;
};

// --- Animation Script (Optimized for Speed) ---
const SCRIPT_SEQUENCE = [
  // 1. Start in DM
  { type: 'switch', mode: 'dm', name: 'Shivaraj Kolekar', tab: 'friends' },
  { type: 'delay', ms: 300 }, // Reduced start delay
  { type: 'msg', sender: 'me', text: 'Yo, check out this latency! ⚡️' },
  { type: 'delay', ms: 400 },
  { type: 'typing', show: true },
  { type: 'delay', ms: 800 }, // Faster typing simulation
  { type: 'typing', show: false },
  { type: 'msg', sender: 'other', text: 'Wait, did that send already?', name: 'Shivaraj' },
  { type: 'delay', ms: 300 },
  { type: 'msg', sender: 'me', text: 'Instant. 14ms global avg.' },
  { type: 'delay', ms: 800 }, // Quick pause before switch
  
  // 2. Switch to Group
  { type: 'switch', mode: 'group', name: 'F1 Group', tab: 'groups' },
  { type: 'system', text: 'Shivaraj added you to the group' },
  { type: 'delay', ms: 400 },
  { type: 'msg', sender: 'other', text: 'Guys, the new socket engine is live.', name: 'Alex' },
  { type: 'delay', ms: 200 }, // Rapid fire messages
  { type: 'msg', sender: 'other', text: 'Finally! 🚀', name: 'Sarah' },
  { type: 'delay', ms: 400 },
  { type: 'msg', sender: 'me', text: 'Handling 10k concurrents easy.' },
  { type: 'delay', ms: 1500 }, // Short pause before loop restart
];

// --- Mock Chat UI Component ---
const MockChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatName, setActiveChatName] = useState('Shivaraj Kolekar');
  const [inputText, setInputText] = useState('');
  
  // UI States
  const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
  const [selectedId, setSelectedId] = useState('shiv'); // 'shiv' or 'f1'

  // Scroll Ref
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
            // Update UI State
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
               // Fast typing effect for 'me'
               setInputText(step.text || '');
               setTimeout(() => {
                 setInputText('');
                 addMessage(step);
               }, 200); // Faster input clear
            } else {
              addMessage(step);
            }
          }, currentTime);
          timeoutIds.push(tid);
        }
      });

      // Loop restart
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
                                    <p className="text-[10px] font-bold text-indigo-400 mb-1">{msg.senderName}</p>
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

// --- Main Section ---
const Features = () => {
  return (
    <section className="w-full min-h-screen bg-black py-32 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                
                {/* Text Side (35%) */}
                <div className="w-full lg:w-[35%] flex flex-col gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm"
                    >
                        <MessageSquare size={14} className="text-white" />
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Core Messaging</span>
                    </motion.div>
                    
                    <div className="space-y-4">
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
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6, delay: 0.3 }}
                         viewport={{ once: true }}
                         className="grid grid-cols-2 gap-4"
                    >
                        <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors">
                            <Users className="text-indigo-400 mb-3" size={24} />
                            <div className="text-2xl font-bold text-white mb-1">Unlimited</div>
                            <div className="text-xs text-white/40 font-medium uppercase tracking-wide">Group Capacity</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors">
                            <Zap className="text-yellow-500 fill-yellow-500 mb-3" size={24} />
                            <div className="text-2xl font-bold text-white mb-1">14ms</div>
                            <div className="text-xs text-white/40 font-medium uppercase tracking-wide">Global Latency</div>
                        </div>
                    </motion.div>
                </div>

                {/* Animation Side (65%) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-[65%] relative"
                >
                    <MockChatUI />
                </motion.div>

            </div>

            <div className="absolute left-8 lg:left-[17.5%] -bottom-32 w-px h-32 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
    </section>
  );
};

export default Features;
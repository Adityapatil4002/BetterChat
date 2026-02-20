"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
  ChevronRight,
  Globe,
  ShieldCheck,
  Lock,
  Wifi,
  ArrowUpRight,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  senderName?: string;
  timestamp: string;
};

const SCRIPT_SEQUENCE = [
  { type: "switch", mode: "dm", name: "Shivaraj Kolekar", tab: "friends" },
  { type: "delay", ms: 600 },
  { type: "msg", sender: "me", text: "Yo, check out this latency! ⚡️" },
  { type: "delay", ms: 700 },
  { type: "typing", show: true },
  { type: "delay", ms: 1000 },
  { type: "typing", show: false },
  {
    type: "msg",
    sender: "other",
    text: "Wait, did that send already?",
    name: "Shivaraj",
  },
  { type: "delay", ms: 600 },
  { type: "msg", sender: "me", text: "Instant. 14ms global avg." },
  { type: "delay", ms: 800 },
  { type: "typing", show: true },
  { type: "delay", ms: 900 },
  { type: "typing", show: false },
  {
    type: "msg",
    sender: "other",
    text: "That's insane 🔥 faster than Discord",
    name: "Shivaraj",
  },
  { type: "delay", ms: 1200 },

  { type: "switch", mode: "group", name: "F1 Group", tab: "groups" },
  { type: "delay", ms: 400 },
  { type: "system", text: "Shivaraj added you to the group" },
  { type: "delay", ms: 700 },
  {
    type: "msg",
    sender: "other",
    text: "Guys, the new socket engine is live.",
    name: "Alex",
  },
  { type: "delay", ms: 500 },
  { type: "msg", sender: "other", text: "Finally! 🚀", name: "Sarah" },
  { type: "delay", ms: 600 },
  { type: "msg", sender: "me", text: "Handling 10k concurrents easy." },
  { type: "delay", ms: 800 },
  { type: "typing", show: true },
  { type: "delay", ms: 1000 },
  { type: "typing", show: false },
  {
    type: "msg",
    sender: "other",
    text: "Zero message drops. This is production ready.",
    name: "Alex",
  },
  { type: "delay", ms: 700 },
  {
    type: "msg",
    sender: "me",
    text: "E2E encrypted too. Ship it. 🛡️",
  },
  { type: "delay", ms: 2000 },
];

// ─── MOCK CHAT UI ────────────────────────────────────────────────────────────
const MockChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatName, setActiveChatName] = useState("Shivaraj Kolekar");
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const [selectedId, setSelectedId] = useState("shiv");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll only inside the chat container — never the page
  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const addMessage = (step: any) => {
      if (cancelled) return;
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          text: step.text,
          sender: step.sender || "system",
          senderName: step.name,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        },
      ]);
    };

    const runScript = () => {
      if (cancelled) return;
      setMessages([]);
      setIsTyping(false);
      setInputText("");
      let currentTime = 0;

      SCRIPT_SEQUENCE.forEach((step) => {
        if (step.type === "delay") {
          currentTime += step.ms || 0;
        } else if (step.type === "switch") {
          const tid = setTimeout(() => {
            if (cancelled) return;
            setActiveTab(step.tab as "friends" | "groups");
            setActiveChatName(step.name || "");
            setSelectedId(step.mode === "dm" ? "shiv" : "f1");
            setMessages([]);
          }, currentTime);
          timeoutIds.push(tid);
        } else if (step.type === "typing") {
          const tid = setTimeout(() => {
            if (cancelled) return;
            setIsTyping(step.show || false);
          }, currentTime);
          timeoutIds.push(tid);
        } else if (step.type === "msg" || step.type === "system") {
          const tid = setTimeout(() => {
            if (cancelled) return;
            if (step.sender === "me") {
              setInputText(step.text || "");
              const inner = setTimeout(() => {
                if (cancelled) return;
                setInputText("");
                addMessage(step);
              }, 250);
              timeoutIds.push(inner);
            } else {
              addMessage(step);
            }
          }, currentTime);
          timeoutIds.push(tid);
        }
      });

      // Loop continuously
      const loopTid = setTimeout(runScript, currentTime + 800);
      timeoutIds.push(loopTid);
    };

    runScript();

    return () => {
      cancelled = true;
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full h-[600px] bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden flex shadow-2xl shadow-black/50 relative font-sans select-none">
      {/* SIDEBAR */}
      <div className="w-[280px] border-r border-white/[0.08] bg-[#0A0A0A] hidden md:flex flex-col shrink-0 z-20">
        <div className="h-14 flex items-center px-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <MessageSquare size={14} className="text-black fill-black" />
            </div>
            <span className="font-bold text-white tracking-tight">
              BetterChat
            </span>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="bg-[#151515] border border-white/[0.05] rounded-md flex items-center px-3 py-1.5 gap-2">
            <Search size={14} className="text-zinc-500" />
            <span className="text-xs text-zinc-500">Search friends...</span>
          </div>
        </div>

        <div className="px-3 pb-2">
          <div className="bg-[#151515] p-1 rounded-lg flex border border-white/[0.05]">
            <div
              className={cn(
                "flex-1 py-1 text-[11px] font-medium text-center rounded-md transition-all duration-300",
                activeTab === "friends"
                  ? "bg-[#252525] text-white shadow-sm"
                  : "text-zinc-500"
              )}
            >
              Friends
            </div>
            <div
              className={cn(
                "flex-1 py-1 text-[11px] font-medium text-center rounded-md transition-all duration-300",
                activeTab === "groups"
                  ? "bg-[#252525] text-white shadow-sm"
                  : "text-zinc-500"
              )}
            >
              Groups
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            {activeTab === "friends" ? "Online - 4" : "Your Groups"}
          </div>

          {activeTab === "friends" && (
            <>
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-all",
                  selectedId === "shiv" ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
                )}
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">
                    SK
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    Shivaraj Kolekar
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    Core Messaging is live
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#151515] opacity-60">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                    AJ
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0A0A0A] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-300 truncate">
                    Arjun
                  </div>
                  <div className="text-[11px] text-zinc-600 truncate">
                    Designing...
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "groups" && (
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-md transition-all",
                selectedId === "f1" ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-[#252525] border border-white/5 flex items-center justify-center text-zinc-400">
                <Hash size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  F1 Group
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  Active now
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-white/[0.08]">
          <div className="p-2 space-y-0.5">
            {[
              { icon: LayoutGrid, label: "Groups" },
              { icon: Users, label: "Friends" },
              { icon: Settings, label: "Settings" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#151515] rounded-md transition-colors cursor-pointer"
              >
                <Icon size={16} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.08] bg-[#080808]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User size={14} className="text-zinc-400" />
                </div>
                <div className="text-xs text-white font-medium">User 8002</div>
              </div>
              <LogOut
                size={14}
                className="text-zinc-600 hover:text-white cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col bg-[#050505] relative z-10">
        <div className="h-14 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#050505]/95 backdrop-blur-sm z-30">
          <div className="flex items-center gap-3">
            {activeTab === "friends" ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[10px] font-bold text-white">
                SK
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#252525] border border-white/5 flex items-center justify-center text-zinc-400">
                <Hash size={14} />
              </div>
            )}
            <div>
              <h3 className="text-white font-medium text-sm leading-none mb-0.5">
                {activeChatName}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {[Phone, Video].map((Icon, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer"
              >
                <Icon size={16} />
              </div>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <div className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors cursor-pointer">
              <MoreVertical size={16} />
            </div>
          </div>
        </div>

        {/* Messages — scrolls only inside this container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5"
          style={{ overscrollBehavior: "contain" }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                layout
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={cn(
                  "flex w-full",
                  msg.sender === "me"
                    ? "justify-end"
                    : msg.sender === "system"
                    ? "justify-center"
                    : "justify-start"
                )}
              >
                {msg.sender === "system" ? (
                  <div className="flex items-center gap-3 w-full my-2">
                    <div className="h-px bg-white/[0.04] flex-1" />
                    <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
                      {msg.text}
                    </span>
                    <div className="h-px bg-white/[0.04] flex-1" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      msg.sender === "me"
                        ? "bg-white text-black rounded-tr-sm"
                        : "bg-[#18181b] text-zinc-200 rounded-tl-sm border border-white/[0.06]"
                    )}
                  >
                    {msg.sender === "other" && activeTab === "groups" && (
                      <p className="text-[10px] font-bold text-white/50 mb-1">
                        {msg.senderName}
                      </p>
                    )}
                    <span className="leading-relaxed">{msg.text}</span>
                    <span
                      className={cn(
                        "text-[9px] block text-right mt-1 opacity-50 font-medium select-none",
                        msg.sender === "me" ? "text-black/60" : "text-zinc-500"
                      )}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

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
                  {[0, 0.1, 0.2].map((delay, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay }}
                      className="w-1 h-1 bg-zinc-400 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 bg-[#050505] border-t border-white/[0.08]">
          <div className="bg-[#121212] border border-white/[0.08] rounded-xl px-2 py-2 flex items-center gap-3 shadow-inner">
            <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Plus size={20} />
            </div>
            <input
              type="text"
              readOnly
              value={inputText}
              placeholder={`Message ${
                activeTab === "groups" ? "#F1 Group" : activeChatName
              }`}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600 font-medium"
            />
            <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Smile size={20} />
            </div>
            <div
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                inputText
                  ? "bg-white text-black scale-100"
                  : "bg-white/5 text-zinc-600 scale-95"
              )}
            >
              <Send size={16} className={inputText ? "fill-black" : ""} />
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-zinc-700">
              Protected by end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Animated Counter ────────────────────────────────────────────────────────
const AnimatedCounter = ({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// ─── Animated Progress Bar ──────────────────────────────────────────────────
const AnimatedBar = ({
  width,
  delay = 0,
  color = "bg-white/20",
}: {
  width: string;
  delay?: number;
  color?: string;
}) => (
  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full rounded-full", color)}
    />
  </div>
);

// ─── Hover Card Wrapper ─────────────────────────────────────────────────────
const HoverPanel = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotlightX = useSpring(x, { stiffness: 200, damping: 30 });
  const spotlightY = useSpring(y, { stiffness: 200, damping: 30 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden group", className)}
    >
      {/* Spotlight effect that follows cursor */}
      <motion.div
        className="pointer-events-none absolute w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"
        style={{ left: spotlightX, top: spotlightY }}
      />
      {children}
    </motion.div>
  );
};

// ─── MAIN FEATURES COMPONENT ────────────────────────────────────────────────
const Features = () => {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — CHAT INTERFACE
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm mb-8"
        >
          <MessageSquare size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            Core Messaging
          </span>
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
            Experience chat that moves as fast as you think. BetterChat delivers
            messages in{" "}
            <span className="text-white font-medium">under 14ms</span>{" "}
            globally.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl relative"
        >
          <MockChatUI />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — 4 PANELS (SHARP BORDERS)
          Row 1: 65% | 35%
          Row 2: 60% | 40%
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-10">
        <div className="w-full h-px bg-white/[0.06]" />

        {/* ROW 1 */}
        <div className="flex flex-col md:flex-row w-full">
          {/* ROW 1 — LEFT 65%: Real-time Messaging Engine */}
          <HoverPanel
            delay={0.1}
            className="w-full md:w-[65%] border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-10 md:p-16 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  Messaging Engine
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight tracking-tight">
                Messages delivered
                <br />
                before you blink.
              </h3>

              <p className="text-zinc-500 text-base md:text-lg mb-10 max-w-md leading-relaxed">
                Built on WebSocket multiplexing with intelligent connection
                pooling. Every message finds the fastest route across our global
                edge network.
              </p>

              {/* Live metrics */}
              <div className="grid grid-cols-3 gap-8 mb-10">
                <div>
                  <div className="text-3xl font-bold text-white tracking-tight mb-1">
                    <AnimatedCounter target={14} suffix="ms" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                    Avg Latency
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tracking-tight mb-1">
                    <AnimatedCounter target={50} suffix="+" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                    Edge Nodes
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tracking-tight mb-1">
                    <AnimatedCounter target={99} suffix=".9%" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                    Uptime SLA
                  </div>
                </div>
              </div>

              {/* Mini progress bars */}
              <div className="space-y-3 max-w-sm">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                      North America
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      8ms
                    </span>
                  </div>
                  <AnimatedBar width="95%" delay={0.1} color="bg-white/30" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                      Europe
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      12ms
                    </span>
                  </div>
                  <AnimatedBar width="88%" delay={0.2} color="bg-white/25" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                      Asia Pacific
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      18ms
                    </span>
                  </div>
                  <AnimatedBar width="78%" delay={0.3} color="bg-white/20" />
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-white text-sm font-medium hover:gap-3 transition-all mt-10 group/link"
              >
                View architecture docs
                <ChevronRight
                  size={14}
                  className="group-hover/link:translate-x-0.5 transition-transform"
                />
              </a>
            </div>
          </HoverPanel>

          {/* ROW 1 — RIGHT 35%: Group Chat */}
          <HoverPanel delay={0.2} className="w-full md:w-[35%]">
            <div className="p-10 md:p-12 flex flex-col justify-between h-full relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Groups that scale
                </h3>

                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  From small teams to communities of 100,000+. No message drops,
                  no lag, no compromises on delivery guarantees.
                </p>

                {/* Animated user count visualization */}
                <div className="space-y-5">
                  {[
                    { label: "Small Team", count: "10", bar: "20%" },
                    { label: "Organization", count: "1,000", bar: "50%" },
                    { label: "Community", count: "100k+", bar: "100%" },
                  ].map((tier, i) => (
                    <div key={tier.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500 font-medium">
                          {tier.label}
                        </span>
                        <span className="text-xs text-white font-mono">
                          {tier.count}
                        </span>
                      </div>
                      <AnimatedBar
                        width={tier.bar}
                        delay={0.2 + i * 0.15}
                        color="bg-emerald-500/30"
                      />
                    </div>
                  ))}
                </div>

                {/* Floating avatars */}
                <div className="flex items-center mt-8">
                  <div className="flex -space-x-2">
                    {["SK", "AJ", "MR", "LS"].map((initials, i) => (
                      <motion.div
                        key={initials}
                        initial={{ opacity: 0, scale: 0, x: -10 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-zinc-400"
                      >
                        {initials}
                      </motion.div>
                    ))}
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="text-[11px] text-zinc-600 ml-3"
                  >
                    +12,847 online
                  </motion.span>
                </div>
              </div>

              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors mt-10"
              >
                Learn about groups <ChevronRight size={12} />
              </a>
            </div>
          </HoverPanel>
        </div>

        <div className="w-full h-px bg-white/[0.06]" />

        {/* ROW 2 */}
        <div className="flex flex-col md:flex-row w-full">
          {/* ROW 2 — LEFT 60%: Encryption */}
          <HoverPanel
            delay={0.3}
            className="w-full md:w-[60%] border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-10 md:p-16 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                  Security
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                End-to-end encrypted.
                <br />
                <span className="text-white/40">Always.</span>
              </h3>

              <p className="text-zinc-500 text-sm md:text-base mb-10 max-w-lg leading-relaxed">
                Every message, file, and call is encrypted with the Signal
                Protocol. Not even we can read your messages. Your privacy is
                non-negotiable.
              </p>

              {/* Animated encryption visualization */}
              <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-6 max-w-md">
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center"
                  >
                    <Lock size={14} className="text-emerald-400/70" />
                  </motion.div>
                  <div>
                    <div className="text-xs text-white font-medium">
                      Message Encrypted
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">
                      Signal Protocol · AES-256-GCM
                    </div>
                  </div>
                </div>

                {/* Encryption animation */}
                <div className="space-y-2 font-mono text-xs">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-zinc-700">IN</span>
                    <span className="text-white">&quot;Hello team!&quot;</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="h-px bg-gradient-to-r from-emerald-500/30 to-transparent origin-left"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-zinc-700">OUT</span>
                    <span className="text-emerald-400/50 break-all">
                      0x7a3f...e9b2c8d1
                    </span>
                  </motion.div>
                </div>

                {/* Status dots */}
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/[0.04]">
                  {["Key Exchange", "Verification", "Delivery"].map(
                    (step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.4 + i * 0.2 }}
                        className="flex items-center gap-1.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <span className="text-[9px] text-zinc-600">{step}</span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-white text-sm font-medium hover:gap-3 transition-all mt-10 group/link"
              >
                Security whitepaper
                <ArrowUpRight
                  size={14}
                  className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </HoverPanel>

          {/* ROW 2 — RIGHT 40%: Developer SDK */}
          <HoverPanel delay={0.4} className="w-full md:w-[40%]">
            <div className="p-10 md:p-12 flex flex-col justify-between h-full relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Developer-first SDK
                </h3>

                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Ship chat in minutes, not months. Type-safe APIs, real-time
                  hooks, and framework adapters for React, Vue, and Swift.
                </p>

                {/* Code block */}
                <div className="bg-[#080808] border border-white/[0.06] rounded-lg p-5 font-mono text-[13px] leading-relaxed">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-zinc-600 mb-3">
                      {"// Initialize in 3 lines"}
                    </div>
                    <div>
                      <span className="text-zinc-500">import</span>{" "}
                      <span className="text-white">{"{ BetterChat }"}</span>{" "}
                      <span className="text-zinc-500">from</span>{" "}
                      <span className="text-emerald-400/60">
                        &apos;@betterchat/sdk&apos;
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="text-zinc-500">const</span>{" "}
                      <span className="text-white">chat</span>{" "}
                      <span className="text-zinc-600">=</span>{" "}
                      <span className="text-zinc-400">BetterChat</span>
                      <span className="text-zinc-600">.</span>
                      <span className="text-white">init</span>
                      <span className="text-zinc-600">({"{"}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-zinc-500">apiKey</span>
                      <span className="text-zinc-600">:</span>{" "}
                      <span className="text-emerald-400/60">
                        &apos;sk_live_...&apos;
                      </span>
                      <span className="text-zinc-600">,</span>
                    </div>
                    <div>
                      <span className="text-zinc-600">{"})"}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-zinc-500">await</span>{" "}
                      <span className="text-white">chat</span>
                      <span className="text-zinc-600">.</span>
                      <span className="text-white">send</span>
                      <span className="text-zinc-600">(</span>
                      <span className="text-emerald-400/60">
                        &apos;Hello! 👋&apos;
                      </span>
                      <span className="text-zinc-600">)</span>
                    </div>
                  </motion.div>
                </div>

                {/* SDK language badges */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {["TypeScript", "Python", "Go", "Swift", "Kotlin"].map(
                    (lang, i) => (
                      <motion.span
                        key={lang}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.08 }}
                        className="text-[10px] font-medium text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md hover:border-white/[0.12] hover:text-zinc-300 transition-colors cursor-default"
                      >
                        {lang}
                      </motion.span>
                    )
                  )}
                </div>
              </div>

              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors mt-10"
              >
                View documentation <ChevronRight size={12} />
              </a>
            </div>
          </HoverPanel>
        </div>

        <div className="w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  );
};

export default Features;
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
  Mail,
  FileText,
  Calendar,
  BookOpen,
  Check,
  ArrowUpRight,
  X,
  Clock,
  Paperclip,
  Code2,
  Webhook,
  Link2,
  Zap,
  Shield,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  senderName?: string;
  timestamp: string;
};

type ScriptStep =
  | { type: "delay"; ms: number }
  | { type: "msg"; sender: "me" | "other"; text: string; name?: string }
  | { type: "system"; text: string }
  | { type: "typing"; show: boolean }
  | { type: "zoom"; zoomed: boolean }
  | { type: "panel"; show: boolean }
  | { type: "integ"; id: string | null }
  | { type: "input"; text: string }
  | { type: "reset" };

// ─── INTEGRATION DATA ───────────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: "gmail",
    name: "Gmail",
    icon: Mail,
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/15",
    ring: "ring-red-500/20",
  },
  {
    id: "docs",
    name: "Google Docs",
    icon: FileText,
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
    ring: "ring-blue-500/20",
  },
  {
    id: "notion",
    name: "Notion",
    icon: BookOpen,
    accent: "text-white",
    bg: "bg-white/10",
    border: "border-white/15",
    ring: "ring-white/20",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    accent: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/15",
    ring: "ring-green-500/20",
  },
];

// ─── ANIMATION SCRIPT ───────────────────────────────────────────────────────
const SCRIPT: ScriptStep[] = [
  // Phase 1: Normal chat
  {
    type: "msg",
    sender: "other",
    text: "Can you email the project update and set up tomorrow's standup?",
    name: "Sarah",
  },
  { type: "delay", ms: 1000 },
  {
    type: "msg",
    sender: "me",
    text: "On it — let me pull up integrations real quick",
  },
  { type: "delay", ms: 800 },
  { type: "typing", show: true },
  { type: "delay", ms: 900 },
  { type: "typing", show: false },
  {
    type: "msg",
    sender: "other",
    text: "Use the + button, it's insanely fast ⚡",
    name: "Sarah",
  },
  { type: "delay", ms: 1200 },

  // Phase 2: Focus on input + show panel
  { type: "zoom", zoomed: true },
  { type: "delay", ms: 900 },
  { type: "panel", show: true },
  { type: "delay", ms: 700 },

  // Phase 3: Gmail
  { type: "integ", id: "gmail" },
  { type: "delay", ms: 2200 },

  // Phase 4: Google Docs
  { type: "integ", id: "docs" },
  { type: "delay", ms: 2200 },

  // Phase 5: Notion
  { type: "integ", id: "notion" },
  { type: "delay", ms: 2200 },

  // Phase 6: Calendar
  { type: "integ", id: "calendar" },
  { type: "delay", ms: 2200 },

  // Phase 7: Close
  { type: "integ", id: null },
  { type: "delay", ms: 300 },
  { type: "panel", show: false },
  { type: "delay", ms: 300 },
  { type: "zoom", zoomed: false },
  { type: "delay", ms: 600 },

  // Phase 8: Confirmation
  {
    type: "msg",
    sender: "me",
    text: "✓ Done! Email sent, docs shared, standup scheduled 🎯",
  },
  { type: "delay", ms: 900 },
  { type: "typing", show: true },
  { type: "delay", ms: 700 },
  { type: "typing", show: false },
  {
    type: "msg",
    sender: "other",
    text: "All from one chat bar. This is the future 🔥",
    name: "Sarah",
  },
  { type: "delay", ms: 2500 },
];

// ─── INTEGRATION PREVIEW CARDS ──────────────────────────────────────────────
const GmailPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-[#0E0E0E] border border-red-500/10 rounded-xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center">
        <Mail size={14} className="text-red-400" />
      </div>
      <span className="text-sm font-semibold text-white">Compose Email</span>
    </div>
    <div className="space-y-2.5 text-xs font-mono">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2"
      >
        <span className="text-zinc-600 w-12">To:</span>
        <span className="text-white">team@company.com</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2"
      >
        <span className="text-zinc-600 w-12">Subj:</span>
        <span className="text-white">Q4 Project Update</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.65 }}
        className="flex gap-2"
      >
        <span className="text-zinc-600 w-12">Body:</span>
        <span className="text-zinc-400">Hi team, here&apos;s the latest...</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-1.5 text-emerald-400 pt-2 font-sans font-medium"
      >
        <Check size={12} />
        Sent to 12 members
      </motion.div>
    </div>
  </motion.div>
);

const DocsPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-[#0E0E0E] border border-blue-500/10 rounded-xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
        <FileText size={14} className="text-blue-400" />
      </div>
      <span className="text-sm font-semibold text-white">New Document</span>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/[0.03] border border-white/5 rounded-lg p-3 mb-3"
    >
      <div className="text-sm text-white font-medium mb-1">
        Sprint Planning Notes
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="h-1.5 bg-blue-500/20 rounded-full mb-1.5"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "50%" }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="h-1.5 bg-blue-500/10 rounded-full"
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"
    >
      <Check size={12} />
      Shared with edit access
    </motion.div>
  </motion.div>
);

const NotionPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-[#0E0E0E] border border-white/10 rounded-xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
        <BookOpen size={14} className="text-white" />
      </div>
      <span className="text-sm font-semibold text-white">Link Page</span>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/[0.03] border border-white/5 rounded-lg p-3 mb-3 space-y-2"
    >
      <div className="text-sm text-white font-medium">📋 Project Roadmap</div>
      <div className="flex gap-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded"
        >
          Status: Active
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded"
        >
          Sprint 14
        </motion.span>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"
    >
      <Check size={12} />
      Linked &amp; auto-syncing
    </motion.div>
  </motion.div>
);

const CalendarPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-[#0E0E0E] border border-green-500/10 rounded-xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
        <Calendar size={14} className="text-green-400" />
      </div>
      <span className="text-sm font-semibold text-white">Schedule Event</span>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/[0.03] border border-white/5 rounded-lg p-3 mb-3 space-y-1.5"
    >
      <div className="text-sm text-white font-medium">Daily Standup</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-1.5 text-xs text-zinc-400"
      >
        <Clock size={10} />
        Tomorrow · 10:00 AM
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-1.5 text-xs text-zinc-400"
      >
        <Users size={10} />5 participants
      </motion.div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"
    >
      <Check size={12} />
      Invites sent
    </motion.div>
  </motion.div>
);

const PREVIEW_MAP: Record<string, React.FC> = {
  gmail: GmailPreview,
  docs: DocsPreview,
  notion: NotionPreview,
  calendar: CalendarPreview,
};

// ─── INTEGRATIONS CHAT UI ───────────────────────────────────────────────────
const IntegrationsChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [activeInteg, setActiveInteg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const addMessage = (
      sender: "me" | "other" | "system",
      text: string,
      name?: string
    ) => {
      if (cancelled) return;
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          text,
          sender,
          senderName: name,
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

      // Reset all state
      setMessages([]);
      setIsTyping(false);
      setInputText("");
      setIsZoomed(false);
      setShowPanel(false);
      setActiveInteg(null);

      let currentTime = 0;

      SCRIPT.forEach((step) => {
        if (step.type === "delay") {
          currentTime += step.ms;
          return;
        }

        const tid = setTimeout(() => {
          if (cancelled) return;

          switch (step.type) {
            case "msg":
              if (step.sender === "me") {
                setInputText(step.text);
                const inner = setTimeout(() => {
                  if (cancelled) return;
                  setInputText("");
                  addMessage("me", step.text);
                }, 250);
                timeoutIds.push(inner);
              } else {
                addMessage("other", step.text, step.name);
              }
              break;
            case "system":
              addMessage("system", step.text);
              break;
            case "typing":
              setIsTyping(step.show);
              break;
            case "zoom":
              setIsZoomed(step.zoomed);
              break;
            case "panel":
              setShowPanel(step.show);
              break;
            case "integ":
              setActiveInteg(step.id);
              break;
            case "input":
              setInputText(step.text);
              break;
          }
        }, currentTime);

        timeoutIds.push(tid);
      });

      const loopTid = setTimeout(runScript, currentTime + 800);
      timeoutIds.push(loopTid);
    };

    runScript();
    return () => {
      cancelled = true;
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  const PreviewComponent = activeInteg ? PREVIEW_MAP[activeInteg] : null;

  return (
    <div className="w-full h-[650px] bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden flex shadow-2xl shadow-black/50 relative font-sans select-none">
      {/* SIDEBAR */}
      <div className="w-[260px] border-r border-white/[0.08] bg-[#0A0A0A] hidden md:flex flex-col shrink-0 z-20">
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
            <span className="text-xs text-zinc-500">Search...</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            Channels
          </div>
          {["general", "engineering", "design"].map((ch) => (
            <div
              key={ch}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md transition-all",
                ch === "general" ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
              )}
            >
              <Hash size={14} className="text-zinc-500" />
              <span
                className={cn(
                  "text-sm",
                  ch === "general"
                    ? "text-white font-medium"
                    : "text-zinc-500"
                )}
              >
                {ch}
              </span>
            </div>
          ))}

          <div className="px-2 py-1 mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            Direct Messages
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md bg-[#1F1F1F]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white">
                SA
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#0A0A0A] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                Sarah Anderson
              </div>
              <div className="text-[10px] text-zinc-500">Active now</div>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/[0.08]">
          <div className="p-2 space-y-0.5">
            {[
              { icon: LayoutGrid, label: "Integrations" },
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
                <div className="text-xs text-white font-medium">You</div>
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
        {/* Header */}
        <div className="h-14 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#050505]/95 backdrop-blur-sm z-40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white">
              SA
            </div>
            <div>
              <h3 className="text-white font-medium text-sm leading-none mb-0.5">
                Sarah Anderson
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

        {/* Messages area — shrinks when zoomed */}
        <motion.div
          animate={{
            flex: isZoomed ? 0.25 : 1,
            opacity: isZoomed ? 0.15 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden min-h-0"
        >
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-5"
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
                      {msg.sender === "other" && msg.senderName && (
                        <p className="text-[10px] font-bold text-white/50 mb-1">
                          {msg.senderName}
                        </p>
                      )}
                      <span className="leading-relaxed">{msg.text}</span>
                      <span
                        className={cn(
                          "text-[9px] block text-right mt-1 opacity-50 font-medium select-none",
                          msg.sender === "me"
                            ? "text-black/60"
                            : "text-zinc-500"
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
                        transition={{
                          repeat: Infinity,
                          duration: 0.5,
                          delay,
                        }}
                        className="w-1 h-1 bg-zinc-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Integration Panel — slides up between messages and input */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/[0.06] bg-[#080808] relative z-30"
            >
              <div className="p-4 sm:p-6">
                {/* Integration icons row */}
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={12} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Integrations
                  </span>
                </div>

                <div className="flex gap-3 mb-5">
                  {INTEGRATIONS.map((integ, i) => {
                    const Icon = integ.icon;
                    const isActive = activeInteg === integ.id;
                    return (
                      <motion.div
                        key={integ.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer",
                          isActive
                            ? cn(integ.bg, integ.border, "ring-1", integ.ring)
                            : "bg-white/[0.03] border-white/[0.06] hover:border-white/10"
                        )}
                      >
                        <Icon
                          size={14}
                          className={isActive ? integ.accent : "text-zinc-500"}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium hidden sm:inline",
                            isActive ? "text-white" : "text-zinc-500"
                          )}
                        >
                          {integ.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Preview card */}
                <AnimatePresence mode="wait">
                  {PreviewComponent && (
                    <PreviewComponent key={activeInteg!} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area — highlighted when zoomed */}
        <motion.div
          animate={{
            backgroundColor: isZoomed
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-4 border-t transition-all duration-500 shrink-0 relative z-30",
            isZoomed ? "border-white/[0.15]" : "border-white/[0.08]"
          )}
        >
          <div
            className={cn(
              "bg-[#121212] border rounded-xl px-2 py-2 flex items-center gap-3 shadow-inner transition-all duration-500",
              isZoomed
                ? "border-white/[0.15] shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                : "border-white/[0.08]"
            )}
          >
            <motion.div
              animate={
                isZoomed && !showPanel
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : { scale: 1 }
              }
              transition={
                isZoomed && !showPanel
                  ? { repeat: Infinity, duration: 0.8 }
                  : {}
              }
              className={cn(
                "p-2 rounded-md transition-colors",
                isZoomed && !showPanel
                  ? "text-white bg-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {showPanel ? (
                <X size={20} />
              ) : (
                <Plus size={20} />
              )}
            </motion.div>
            <input
              type="text"
              readOnly
              value={inputText}
              placeholder="Message Sarah Anderson"
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
        </motion.div>
      </div>
    </div>
  );
};

// ─── HOVER CARD WITH SPOTLIGHT ──────────────────────────────────────────────
const SpotlightCard = ({
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
  const spotX = useSpring(x, { stiffness: 200, damping: 30 });
  const spotY = useSpring(y, { stiffness: 200, damping: 30 });
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
      <motion.div
        className="pointer-events-none absolute w-[250px] h-[250px] rounded-full bg-white/[0.04] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"
        style={{ left: spotX, top: spotY }}
      />
      {children}
    </motion.div>
  );
};

// ─── ANIMATED BAR ───────────────────────────────────────────────────────────
const AnimatedBar = ({
  width,
  delay = 0,
  color = "bg-white/20",
}: {
  width: string;
  delay?: number;
  color?: string;
}) => (
  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full rounded-full", color)}
    />
  </div>
);

// ─── MAIN INTEGRATIONS COMPONENT ────────────────────────────────────────────
const Integrations = () => {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[-5%] w-[500px] h-[500px] bg-violet-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.03] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HEADER + CHAT ANIMATION
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm mb-8"
        >
          <Zap size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            Integrations
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
            Your tools.
            <br />
            <span className="text-white/40">One chat bar.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 leading-relaxed font-light"
          >
            Gmail, Google Docs, Notion, Calendar — access everything from the
            chat input. No tab switching. No context loss.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl relative"
        >
          <IntegrationsChatUI />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — 3 VERTICAL CARDS
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-10">
        <div className="w-full h-px bg-white/[0.06]" />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Card 1: Gmail */}
          <SpotlightCard
            delay={0.1}
            className="border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-8 md:p-10 min-h-[480px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center justify-center mb-6"
                >
                  <Mail className="w-6 h-6 text-red-400" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Gmail Integration
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Compose, reply, and manage emails without ever leaving the
                  chat. AI auto-drafts responses based on conversation context.
                </p>

                {/* Animated email visualization */}
                <div className="space-y-3">
                  {[
                    { label: "Compose", icon: "✍️", bar: "90%" },
                    { label: "Reply", icon: "↩️", bar: "75%" },
                    { label: "Forward", icon: "↗️", bar: "60%" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                          <span>{item.icon}</span> {item.label}
                        </span>
                      </div>
                      <AnimatedBar
                        width={item.bar}
                        delay={0.4 + i * 0.15}
                        color="bg-red-500/25"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">2M+</span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Emails Processed
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 2: Google Docs */}
          <SpotlightCard
            delay={0.2}
            className="border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-8 md:p-10 min-h-[480px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="w-12 h-12 bg-blue-500/10 border border-blue-500/15 rounded-xl flex items-center justify-center mb-6"
                >
                  <FileText className="w-6 h-6 text-blue-400" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Document Hub
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Create Google Docs, Sheets, and Slides directly from chat.
                  Real-time co-editing synced to your conversations.
                </p>

                {/* Animated doc stack */}
                <div className="relative h-40 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30, rotate: 0 }}
                      whileInView={{
                        opacity: 1,
                        y: i * -8,
                        rotate: (i - 1) * 3,
                      }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="absolute w-40 h-24 bg-[#0E0E0E] border border-blue-500/10 rounded-lg p-3"
                      style={{ zIndex: 3 - i }}
                    >
                      <div className="w-20 h-1.5 bg-blue-500/20 rounded-full mb-2" />
                      <div className="w-28 h-1 bg-white/5 rounded-full mb-1.5" />
                      <div className="w-24 h-1 bg-white/5 rounded-full mb-1.5" />
                      <div className="w-16 h-1 bg-white/5 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">500K+</span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Docs Created
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 3: Calendar */}
          <SpotlightCard delay={0.3} className="">
            <div className="p-8 md:p-10 min-h-[480px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="w-12 h-12 bg-green-500/10 border border-green-500/15 rounded-xl flex items-center justify-center mb-6"
                >
                  <Calendar className="w-6 h-6 text-green-400" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Smart Calendar
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Schedule meetings across time zones with AI. It finds the
                  perfect slot, sends invites, and syncs everything.
                </p>

                {/* Animated calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, dayIdx) => (
                    <div
                      key={`h-${dayIdx}`}
                      className="text-[9px] text-zinc-600 text-center font-medium"
                    >
                      {["M", "T", "W", "T", "F", "S", "S"][dayIdx]}
                    </div>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const isHighlighted = i === 10 || i === 17 || i === 24;
                    const isToday = i === 15;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.015 }}
                        className={cn(
                          "aspect-square rounded-md flex items-center justify-center text-[10px]",
                          isToday
                            ? "bg-green-500/20 text-green-400 font-bold"
                            : isHighlighted
                            ? "bg-white/5 text-white"
                            : "text-zinc-700"
                        )}
                      >
                        {i + 1}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">1M+</span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Events Scheduled
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>
        </div>

        <div className="w-full h-px bg-white/[0.06]" />

        {/* ════════════════════════════════════════════════════════════════
            SECTION 3 — 2 HORIZONTAL CARDS (50% / 50%)
            ════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Card 1: Notion */}
          <SpotlightCard
            delay={0.1}
            className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-8 md:p-12 min-h-[320px] flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="w-10 h-10 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center justify-center"
                  >
                    <BookOpen className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Workspace
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  Notion, connected.
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-md">
                  Link pages, databases, and wikis directly in conversations.
                  Auto-sync updates so your team never misses a change.
                </p>

                {/* Notion-like page previews */}
                <div className="flex gap-3">
                  {[
                    {
                      emoji: "📋",
                      title: "Roadmap",
                      tag: "Active",
                    },
                    {
                      emoji: "📊",
                      title: "Metrics",
                      tag: "Updated",
                    },
                    {
                      emoji: "📝",
                      title: "Notes",
                      tag: "Shared",
                    },
                  ].map((page, i) => (
                    <motion.div
                      key={page.title}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 hover:border-white/10 transition-colors cursor-default"
                    >
                      <span className="text-lg mb-1 block">{page.emoji}</span>
                      <div className="text-xs text-white font-medium mb-1">
                        {page.title}
                      </div>
                      <span className="text-[9px] text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {page.tag}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors mt-8"
              >
                Connect Notion{" "}
                <ArrowUpRight
                  size={12}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </SpotlightCard>

          {/* Card 2: API & Custom */}
          <SpotlightCard delay={0.2} className="w-full md:w-1/2">
            <div className="p-8 md:p-12 min-h-[320px] flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="w-10 h-10 bg-white/[0.06] border border-white/[0.08] rounded-lg flex items-center justify-center"
                  >
                    <Code2 className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Developer API
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  Build your own.
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-md">
                  Extensible integration API with webhooks, REST, and GraphQL.
                  Build custom integrations for any tool your team uses.
                </p>

                {/* Code snippet */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#080808] border border-white/[0.06] rounded-lg p-4 font-mono text-[12px] leading-relaxed"
                >
                  <div className="text-zinc-600 mb-2">
                    {"// Register a custom integration"}
                  </div>
                  <div>
                    <span className="text-zinc-500">chat</span>
                    <span className="text-zinc-600">.</span>
                    <span className="text-white">integration</span>
                    <span className="text-zinc-600">({"{"}</span>
                  </div>
                  <div className="pl-3">
                    <span className="text-zinc-500">name</span>
                    <span className="text-zinc-600">: </span>
                    <span className="text-emerald-400/60">
                      &apos;my-tool&apos;
                    </span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div className="pl-3">
                    <span className="text-zinc-500">webhook</span>
                    <span className="text-zinc-600">: </span>
                    <span className="text-emerald-400/60">
                      &apos;https://...&apos;
                    </span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div className="pl-3">
                    <span className="text-zinc-500">onMessage</span>
                    <span className="text-zinc-600">: (</span>
                    <span className="text-zinc-400">ctx</span>
                    <span className="text-zinc-600">)</span>
                    <span className="text-zinc-500"> =&gt; </span>
                    <span className="text-zinc-600">{"{ ... }"}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600">{"})"}</span>
                  </div>
                </motion.div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {["REST", "GraphQL", "Webhooks", "OAuth 2.0", "SDK"].map(
                    (tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.06 }}
                        className="text-[10px] font-medium text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md hover:border-white/[0.12] hover:text-zinc-300 transition-colors cursor-default"
                      >
                        {tech}
                      </motion.span>
                    )
                  )}
                </div>
              </div>

              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors mt-8"
              >
                View API docs <ChevronRight size={12} />
              </a>
            </div>
          </SpotlightCard>
        </div>

        <div className="w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  );
};

export default Integrations;
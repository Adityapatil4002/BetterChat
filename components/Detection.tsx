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
  Sparkles,
  Brain,
  History,
  Target,
  Cpu,
  ArrowUpRight,
  AtSign,
  MessagesSquare,
  Layers,
  Network,
  Fingerprint,
  RefreshCw,
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
  sender: "me" | "other" | "ai" | "system";
  senderName?: string;
  timestamp: string;
  isTyping?: boolean;
};

type ScriptStep =
  | { type: "delay"; ms: number }
  | { type: "msg"; sender: "me" | "other" | "ai"; text: string; name?: string }
  | { type: "system"; text: string }
  | { type: "typing"; sender: "other" | "ai"; show: boolean }
  | { type: "zoom"; zoomed: boolean }
  | { type: "input"; text: string }
  | { type: "detect"; show: boolean }
  | { type: "aiTyping"; show: boolean }
  | { type: "context"; items: string[] }
  | { type: "clear" };

// ─── ANIMATION SCRIPT ───────────────────────────────────────────────────────
const SCRIPT: ScriptStep[] = [
  // Phase 1: Normal conversation
  { type: "msg", sender: "other", text: "Hey, I need help understanding containers for our project", name: "Alex" },
  { type: "delay", ms: 1000 },
  { type: "msg", sender: "me", text: "Sure! Let me ask the AI assistant" },
  { type: "delay", ms: 800 },
  
  // Phase 2: User types @ai command
  { type: "zoom", zoomed: true },
  { type: "delay", ms: 500 },
  { type: "input", text: "@" },
  { type: "delay", ms: 200 },
  { type: "input", text: "@a" },
  { type: "delay", ms: 150 },
  { type: "input", text: "@ai" },
  { type: "delay", ms: 300 },
  { type: "detect", show: true },
  { type: "delay", ms: 400 },
  { type: "input", text: "@ai " },
  { type: "delay", ms: 150 },
  { type: "input", text: "@ai tell" },
  { type: "delay", ms: 100 },
  { type: "input", text: "@ai tell me" },
  { type: "delay", ms: 100 },
  { type: "input", text: "@ai tell me what" },
  { type: "delay", ms: 100 },
  { type: "input", text: "@ai tell me what is" },
  { type: "delay", ms: 100 },
  { type: "input", text: "@ai tell me what is docker" },
  { type: "delay", ms: 500 },
  
  // Phase 3: Send message
  { type: "input", text: "" },
  { type: "detect", show: false },
  { type: "msg", sender: "me", text: "@ai tell me what is docker" },
  { type: "delay", ms: 300 },
  { type: "zoom", zoomed: false },
  { type: "delay", ms: 400 },
  
  // Phase 4: AI Detection indicator
  { type: "system", text: "AI Assistant activated" },
  { type: "delay", ms: 300 },
  { type: "context", items: ["docker", "containers", "project context"] },
  { type: "delay", ms: 500 },
  
  // Phase 5: AI Typing & Response
  { type: "aiTyping", show: true },
  { type: "delay", ms: 2000 },
  { type: "aiTyping", show: false },
  { type: "msg", sender: "ai", text: "Docker is an open-source platform that automates the deployment of applications inside lightweight, portable containers. Containers package code and dependencies together, ensuring consistent behavior across different environments.\n\nKey benefits:\n• Isolation — Apps run independently\n• Portability — Works anywhere Docker runs\n• Efficiency — Shares OS kernel, uses less resources than VMs" },
  { type: "delay", ms: 1500 },
  
  // Phase 6: Follow-up maintaining context
  { type: "typing", sender: "other", show: true },
  { type: "delay", ms: 800 },
  { type: "typing", sender: "other", show: false },
  { type: "msg", sender: "other", text: "Can you ask it how we use this for our Node.js app?", name: "Alex" },
  { type: "delay", ms: 800 },
  
  // Phase 7: User asks follow-up
  { type: "zoom", zoomed: true },
  { type: "delay", ms: 400 },
  { type: "input", text: "@ai how do I containerize a Node.js app?" },
  { type: "delay", ms: 600 },
  { type: "detect", show: true },
  { type: "delay", ms: 400 },
  { type: "input", text: "" },
  { type: "detect", show: false },
  { type: "msg", sender: "me", text: "@ai how do I containerize a Node.js app?" },
  { type: "delay", ms: 300 },
  { type: "zoom", zoomed: false },
  { type: "delay", ms: 300 },
  
  // Phase 8: AI responds with context
  { type: "context", items: ["docker", "Node.js", "containerize", "previous context"] },
  { type: "delay", ms: 400 },
  { type: "aiTyping", show: true },
  { type: "delay", ms: 2200 },
  { type: "aiTyping", show: false },
  { type: "msg", sender: "ai", text: "Building on our Docker discussion, here's how to containerize your Node.js app:\n\n1. Create a Dockerfile:\n```dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```\n\n2. Build: `docker build -t myapp .`\n3. Run: `docker run -p 3000:3000 myapp`\n\nThis keeps your app consistent with what we discussed about containers." },
  { type: "delay", ms: 1500 },
  
  // Phase 9: Confirmation
  { type: "typing", sender: "other", show: true },
  { type: "delay", ms: 600 },
  { type: "typing", sender: "other", show: false },
  { type: "msg", sender: "other", text: "Perfect! It remembered the context 🔥", name: "Alex" },
  { type: "delay", ms: 800 },
  { type: "msg", sender: "me", text: "That's the magic — full conversation memory ✨" },
  { type: "delay", ms: 2500 },
  
  // Reset
  { type: "clear" },
];

// ─── AI DETECTION CHAT UI ───────────────────────────────────────────────────
const DetectionChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<"other" | "ai">("other");
  const [inputText, setInputText] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [showDetect, setShowDetect] = useState(false);
  const [contextItems, setContextItems] = useState<string[]>([]);
  const [showContext, setShowContext] = useState(false);
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
      sender: "me" | "other" | "ai" | "system",
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
      setShowDetect(false);
      setContextItems([]);
      setShowContext(false);

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
                addMessage("me", step.text);
              } else if (step.sender === "ai") {
                addMessage("ai", step.text);
              } else {
                addMessage("other", step.text, step.name);
              }
              break;
            case "system":
              addMessage("system", step.text);
              break;
            case "typing":
              setTypingSender(step.sender);
              setIsTyping(step.show);
              break;
            case "aiTyping":
              setTypingSender("ai");
              setIsTyping(step.show);
              break;
            case "zoom":
              setIsZoomed(step.zoomed);
              break;
            case "input":
              setInputText(step.text);
              break;
            case "detect":
              setShowDetect(step.show);
              break;
            case "context":
              setContextItems(step.items);
              setShowContext(true);
              const hideTid = setTimeout(() => {
                if (!cancelled) setShowContext(false);
              }, 2000);
              timeoutIds.push(hideTid);
              break;
            case "clear":
              setMessages([]);
              setContextItems([]);
              setShowContext(false);
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

  // Check if input contains @ai
  const hasAiMention = inputText.toLowerCase().includes("@ai");

  return (
    <div className="w-full h-[680px] bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden flex shadow-2xl shadow-black/50 relative font-sans select-none">
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
            AI Features
          </div>
          {[
            { icon: Sparkles, label: "AI Assistant", active: true },
            { icon: Brain, label: "Context Memory" },
            { icon: History, label: "Chat History" },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md transition-all",
                active ? "bg-[#1F1F1F]" : "hover:bg-[#151515]"
              )}
            >
              <Icon size={14} className={active ? "text-white" : "text-zinc-500"} />
              <span
                className={cn(
                  "text-sm",
                  active ? "text-white font-medium" : "text-zinc-500"
                )}
              >
                {label}
              </span>
            </div>
          ))}

          <div className="px-2 py-1 mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            Direct Messages
          </div>
          <div className="flex items-center gap-3 p-2 rounded-md bg-[#1F1F1F]">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center text-[10px] font-bold text-white">
                AX
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-white border-2 border-[#0A0A0A] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                Alex Chen
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center text-[10px] font-bold text-white">
              AX
            </div>
            <div>
              <h3 className="text-white font-medium text-sm leading-none mb-0.5">
                Alex Chen
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08]">
              <Sparkles size={12} className="text-white" />
              <span className="text-[10px] text-zinc-400 font-medium">AI Enabled</span>
            </div>
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

        {/* Context indicator floating panel */}
        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0A] border border-white/[0.1] rounded-lg px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain size={12} className="text-white" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Context Loaded
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contextItems.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-[10px] bg-white/[0.06] text-zinc-300 px-2 py-0.5 rounded border border-white/[0.08]"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages area */}
        <motion.div
          animate={{
            flex: isZoomed ? 0.3 : 1,
            opacity: isZoomed ? 0.2 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-3 my-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]"
                    >
                      <Sparkles size={12} className="text-white" />
                      <span className="text-[11px] font-medium text-zinc-400">
                        {msg.text}
                      </span>
                    </motion.div>
                  ) : msg.sender === "ai" ? (
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                          <Sparkles size={12} className="text-black" />
                        </div>
                        <span className="text-[11px] font-semibold text-white">AI Assistant</span>
                      </div>
                      <div className="bg-[#0E0E0E] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                        <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                          {msg.text.split("```").map((part, i) => {
                            if (i % 2 === 1) {
                              // Code block
                              const lines = part.split("\n");
                              const lang = lines[0];
                              const code = lines.slice(1).join("\n");
                              return (
                                <div key={i} className="my-3 bg-[#0A0A0A] border border-white/[0.06] rounded-lg overflow-hidden">
                                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-500 font-mono">{lang}</span>
                                  </div>
                                  <pre className="p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
                                    {code}
                                  </pre>
                                </div>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                        <span className="text-[9px] block text-right mt-2 opacity-50 text-zinc-500 font-medium">
                          {msg.timestamp}
                        </span>
                      </div>
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
                      <span className="leading-relaxed">
                        {msg.text.includes("@ai") ? (
                          <>
                            {msg.text.split("@ai").map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <span className={cn(
                                    "font-semibold px-1 py-0.5 rounded",
                                    msg.sender === "me" 
                                      ? "bg-black/10 text-black" 
                                      : "bg-white/10 text-white"
                                  )}>
                                    @ai
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          msg.text
                        )}
                      </span>
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

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-start"
                >
                  {typingSender === "ai" ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                          <Sparkles size={12} className="text-black" />
                        </div>
                        <span className="text-[11px] font-semibold text-white">AI Assistant</span>
                      </div>
                      <div className="bg-[#0E0E0E] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                delay,
                              }}
                              className="w-1.5 h-1.5 bg-white rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-zinc-500">Thinking...</span>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Input area */}
        <motion.div
          animate={{
            backgroundColor: isZoomed ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-4 border-t transition-all duration-500 shrink-0 relative z-30",
            isZoomed ? "border-white/[0.15]" : "border-white/[0.08]"
          )}
        >
          {/* AI Detection indicator */}
          <AnimatePresence>
            {showDetect && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute -top-12 left-4 right-4 flex items-center justify-center"
              >
                <div className="bg-[#0A0A0A] border border-white/[0.15] rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border border-white/20 rounded flex items-center justify-center"
                  >
                    <Target size={10} className="text-white" />
                  </motion.div>
                  <div>
                    <span className="text-xs font-semibold text-white">@ai detected</span>
                    <span className="text-[10px] text-zinc-500 ml-2">AI Assistant will respond</span>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 h-1 rounded-full bg-white"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "bg-[#121212] border rounded-xl px-2 py-2 flex items-center gap-3 shadow-inner transition-all duration-500",
              isZoomed
                ? "border-white/[0.2] shadow-[0_0_40px_-10px_rgba(255,255,255,0.15)]"
                : "border-white/[0.08]"
            )}
          >
            <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Plus size={20} />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                readOnly
                value={inputText}
                placeholder="Type @ai to ask the AI assistant..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-600 font-medium"
              />
              {/* Highlight @ai in input */}
              {hasAiMention && inputText && (
                <div className="absolute inset-0 pointer-events-none text-sm font-medium">
                  <span className="invisible">{inputText.split("@ai")[0]}</span>
                  <span className="bg-white/10 text-white px-1 py-0.5 rounded">@ai</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <motion.div
                animate={hasAiMention ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={hasAiMention ? { repeat: Infinity, duration: 1.5 } : {}}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  hasAiMention ? "text-white bg-white/10" : "text-zinc-500"
                )}
              >
                <AtSign size={18} />
              </motion.div>
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
          </div>
          <div className="text-center mt-2 flex items-center justify-center gap-2">
            <Sparkles size={10} className="text-zinc-600" />
            <p className="text-[10px] text-zinc-600">
              Type <span className="text-zinc-400 font-medium">@ai</span> to invoke the AI assistant
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── SPOTLIGHT CARD ─────────────────────────────────────────────────────────
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
        className="pointer-events-none absolute w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"
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
}: {
  width: string;
  delay?: number;
}) => (
  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-full bg-white/20"
    />
  </div>
);

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
const AnimatedCounter = ({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
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
          const duration = 2;
          const animate = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
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
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// ─── MAIN DETECTION COMPONENT ───────────────────────────────────────────────
const Detection = () => {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-white/[0.015] blur-[100px] rounded-full" />
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
          <Sparkles size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            AI Detection
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
            Just type{" "}
            <span className="bg-white/10 px-3 py-1 rounded-lg">@ai</span>
            <br />
            <span className="text-white/40">and ask anything.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 leading-relaxed font-light"
          >
            Intelligent detection recognizes when you need AI. Full conversation
            context means responses that actually understand your discussion.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl relative"
        >
          <DetectionChatUI />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — 3 VERTICAL CARDS
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-10">
        <div className="w-full h-px bg-white/[0.06]" />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Card 1: Smart Detection */}
          <SpotlightCard
            delay={0.1}
            className="border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-8 md:p-10 min-h-[520px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center mb-6"
                >
                  <Target className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Instant Detection
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  The moment you type <span className="text-white font-medium">@ai</span>, 
                  our system recognizes your intent and prepares the AI assistant. 
                  No buttons, no menus — just natural conversation.
                </p>

                {/* Detection visualization */}
                <div className="space-y-4">
                  {[
                    { trigger: "@ai", label: "AI Assistant", bar: "100%" },
                    { trigger: "@help", label: "Help Center", bar: "85%" },
                    { trigger: "@search", label: "Search", bar: "75%" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.trigger}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-mono text-white bg-white/[0.06] px-2 py-0.5 rounded">
                          {item.trigger}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {item.label}
                        </span>
                      </div>
                      <AnimatedBar width={item.bar} delay={0.4 + i * 0.15} />
                    </motion.div>
                  ))}
                </div>

                {/* Typing animation preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 bg-[#0A0A0A] border border-white/[0.08] rounded-lg p-4"
                >
                  <div className="text-[10px] text-zinc-600 mb-2 uppercase tracking-wider">
                    Live Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">Hey </span>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-sm text-white bg-white/10 px-1.5 py-0.5 rounded font-medium"
                    >
                      @ai
                    </motion.span>
                    <span className="text-sm text-zinc-400"> what is...</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-0.5 h-4 bg-white"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {"<"}50ms
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Detection Speed
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 2: Context Memory */}
          <SpotlightCard
            delay={0.2}
            className="border-b md:border-b-0 md:border-r border-white/[0.06]"
          >
            <div className="p-8 md:p-10 min-h-[520px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="w-12 h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center mb-6"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Contextual Memory
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  AI doesn&apos;t just answer — it remembers. Every message, topic, and 
                  detail from your conversation is retained. Follow-up questions 
                  feel natural because the context is never lost.
                </p>

                {/* Memory visualization */}
                <div className="relative">
                  <div className="space-y-3">
                    {[
                      { topic: "Docker basics", time: "2 min ago" },
                      { topic: "Node.js setup", time: "Just now" },
                      { topic: "Container config", time: "Active" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.topic}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.12 }}
                        className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-white/30" />
                          <span className="text-xs text-white font-medium">
                            {item.topic}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-600">
                          {item.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Connection lines */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="absolute left-[14px] top-[20px] w-px h-[calc(100%-40px)] bg-gradient-to-b from-white/20 via-white/10 to-transparent origin-top"
                  />
                </div>

                {/* Context tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.85 }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {["docker", "nodejs", "containers", "deployment"].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9 + i * 0.08 }}
                      className="text-[10px] text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-md"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    <AnimatedCounter target={128} suffix="K" />
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Token Context
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 3: Multi-Model */}
          <SpotlightCard delay={0.3} className="">
            <div className="p-8 md:p-10 min-h-[520px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="w-12 h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center mb-6"
                >
                  <Layers className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Multi-Model Support
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Not all questions are equal. Our routing engine automatically 
                  selects the optimal model — from fast responses to deep reasoning. 
                  The best AI for every query, automatically.
                </p>

                {/* Model cards */}
                <div className="space-y-3">
                  {[
                    { name: "GPT-4o", type: "Reasoning", speed: "Fast", active: true },
                    { name: "Claude 3.5", type: "Analysis", speed: "Balanced" },
                    { name: "Gemini Pro", type: "Research", speed: "Deep" },
                  ].map((model, i) => (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.12 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        model.active
                          ? "bg-white/[0.05] border-white/[0.15]"
                          : "bg-white/[0.02] border-white/[0.06]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold",
                          model.active 
                            ? "bg-white text-black" 
                            : "bg-white/[0.06] text-zinc-400"
                        )}>
                          {model.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium">
                            {model.name}
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            {model.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">
                          {model.speed}
                        </span>
                        {model.active && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Routing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 flex items-center gap-2 text-[11px] text-zinc-500"
                >
                  <RefreshCw size={12} className="text-zinc-600" />
                  <span>Auto-routing enabled</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    <AnimatedCounter target={5} suffix="+" />
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Models Available
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>
        </div>

        <div className="w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  );
};

export default Detection;
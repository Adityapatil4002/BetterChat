"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  MessageSquare,
  Sparkles,
  Code2,
  GitBranch,
  Layers,
  Send,
  RotateCw,
  Shield,
  Globe,
  Clock,
  Binary,
  Workflow,
  CircuitBoard,
  Fingerprint,
  Radar,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── STEP CONFIG ────────────────────────────────────────────────────────────
const FLOW_STEPS = [
  {
    id: 1,
    phase: "COMMAND",
    title: "You speak.",
    subtitle: "Natural language input",
    icon: Terminal,
    description:
      "Type your request in plain English. Our parser understands context, intent, and nuance — no special syntax required.",
    color: "white",
  },
  {
    id: 2,
    phase: "PROCESS",
    title: "We understand.",
    subtitle: "Intelligent processing",
    icon: Cpu,
    description:
      "Your command is tokenized, analyzed for intent, matched against context, and routed to the optimal execution engine.",
    color: "white",
  },
  {
    id: 3,
    phase: "EXECUTE",
    title: "It happens.",
    subtitle: "Real-time execution",
    icon: Zap,
    description:
      "Actions fire across our distributed network. APIs are called, data flows, integrations trigger — all in parallel.",
    color: "white",
  },
  {
    id: 4,
    phase: "CONFIRM",
    title: "You see results.",
    subtitle: "Instant confirmation",
    icon: CheckCircle2,
    description:
      "Every action is verified, every result is delivered. Full transparency with real-time status updates.",
    color: "white",
  },
];

// ─── FLOW ANIMATION TIMELINE ────────────────────────────────────────────────
type AnimStep =
  | { type: "phase"; phase: number }
  | { type: "typing"; text: string }
  | { type: "cursor"; visible: boolean }
  | { type: "send" }
  | { type: "token"; tokens: string[] }
  | { type: "intent"; label: string }
  | { type: "route"; target: string }
  | { type: "exec"; tasks: { name: string; status: "pending" | "running" | "done" }[] }
  | { type: "execUpdate"; index: number; status: "running" | "done" }
  | { type: "result"; lines: string[] }
  | { type: "confirm" }
  | { type: "delay"; ms: number }
  | { type: "reset" };

const ANIM_TIMELINE: AnimStep[] = [
  // Phase 1: Command
  { type: "phase", phase: 1 },
  { type: "cursor", visible: true },
  { type: "delay", ms: 600 },
  { type: "typing", text: "@" },
  { type: "delay", ms: 120 },
  { type: "typing", text: "@a" },
  { type: "delay", ms: 100 },
  { type: "typing", text: "@ai" },
  { type: "delay", ms: 200 },
  { type: "typing", text: "@ai " },
  { type: "delay", ms: 100 },
  { type: "typing", text: "@ai send" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a project" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a project update" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a project update to" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a project update to the" },
  { type: "delay", ms: 80 },
  { type: "typing", text: "@ai send a project update to the team" },
  { type: "delay", ms: 500 },
  { type: "send" },
  { type: "cursor", visible: false },
  { type: "delay", ms: 800 },

  // Phase 2: Process
  { type: "phase", phase: 2 },
  { type: "delay", ms: 400 },
  { type: "token", tokens: ["@ai", "send", "project", "update", "team"] },
  { type: "delay", ms: 800 },
  { type: "intent", label: "ACTION: email.compose" },
  { type: "delay", ms: 600 },
  { type: "route", target: "Gmail Integration → Team Channel" },
  { type: "delay", ms: 1000 },

  // Phase 3: Execute
  { type: "phase", phase: 3 },
  { type: "delay", ms: 400 },
  {
    type: "exec",
    tasks: [
      { name: "Fetch project data", status: "pending" },
      { name: "Generate email draft", status: "pending" },
      { name: "Resolve recipients", status: "pending" },
      { name: "Send via Gmail API", status: "pending" },
    ],
  },
  { type: "delay", ms: 500 },
  { type: "execUpdate", index: 0, status: "running" },
  { type: "delay", ms: 600 },
  { type: "execUpdate", index: 0, status: "done" },
  { type: "execUpdate", index: 1, status: "running" },
  { type: "delay", ms: 800 },
  { type: "execUpdate", index: 1, status: "done" },
  { type: "execUpdate", index: 2, status: "running" },
  { type: "delay", ms: 500 },
  { type: "execUpdate", index: 2, status: "done" },
  { type: "execUpdate", index: 3, status: "running" },
  { type: "delay", ms: 700 },
  { type: "execUpdate", index: 3, status: "done" },
  { type: "delay", ms: 600 },

  // Phase 4: Confirm
  { type: "phase", phase: 4 },
  { type: "delay", ms: 400 },
  {
    type: "result",
    lines: [
      "✓ Email sent to 8 team members",
      "✓ Subject: Q4 Project Update",
      "✓ Attachments: progress-report.pdf",
      "✓ Delivery confirmed — 14ms",
    ],
  },
  { type: "delay", ms: 800 },
  { type: "confirm" },
  { type: "delay", ms: 3000 },
  { type: "reset" },
];

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

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
const AnimatedCounter = ({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const dur = 2;
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1000 / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// ─── THE MAIN WORKFLOW VISUALIZATION ────────────────────────────────────────
const WorkflowVisualization = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [inputText, setInputText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [tokens, setTokens] = useState<string[]>([]);
  const [intent, setIntent] = useState("");
  const [route, setRoute] = useState("");
  const [tasks, setTasks] = useState<
    { name: string; status: "pending" | "running" | "done" }[]
  >([]);
  const [resultLines, setResultLines] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const resetAll = () => {
      setActivePhase(0);
      setInputText("");
      setCursorVisible(false);
      setIsSent(false);
      setTokens([]);
      setIntent("");
      setRoute("");
      setTasks([]);
      setResultLines([]);
      setIsConfirmed(false);
    };

    const runTimeline = () => {
      if (cancelled) return;
      resetAll();

      let currentTime = 0;

      ANIM_TIMELINE.forEach((step) => {
        if (step.type === "delay") {
          currentTime += step.ms;
          return;
        }

        const tid = setTimeout(() => {
          if (cancelled) return;

          switch (step.type) {
            case "phase":
              setActivePhase(step.phase);
              break;
            case "typing":
              setInputText(step.text);
              break;
            case "cursor":
              setCursorVisible(step.visible);
              break;
            case "send":
              setIsSent(true);
              break;
            case "token":
              setTokens(step.tokens);
              break;
            case "intent":
              setIntent(step.label);
              break;
            case "route":
              setRoute(step.target);
              break;
            case "exec":
              setTasks([...step.tasks]);
              break;
            case "execUpdate":
              setTasks((prev) => {
                const next = [...prev];
                if (next[step.index]) {
                  next[step.index] = {
                    ...next[step.index],
                    status: step.status,
                  };
                }
                return next;
              });
              break;
            case "result":
              setResultLines(step.lines);
              break;
            case "confirm":
              setIsConfirmed(true);
              break;
            case "reset":
              break;
          }
        }, currentTime);

        timeoutIds.push(tid);
      });

      const loopTid = setTimeout(runTimeline, currentTime + 800);
      timeoutIds.push(loopTid);
    };

    runTimeline();

    return () => {
      cancelled = true;
      timeoutIds.forEach(clearTimeout);
    };
  }, [isInView]);

  const hasAi = inputText.includes("@ai");

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-12 px-4">
        {FLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = activePhase === step.id;
          const isDone = activePhase > step.id;
          return (
            <React.Fragment key={step.id}>
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                className="flex flex-col items-center gap-2 relative"
              >
                <motion.div
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.1)"
                      : isDone
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.02)",
                    borderColor: isActive
                      ? "rgba(255,255,255,0.3)"
                      : isDone
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.06)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center relative overflow-hidden"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-white/[0.08] rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2
                        size={22}
                        className="text-white relative z-10"
                      />
                    </motion.div>
                  ) : (
                    <Icon
                      size={22}
                      className={cn(
                        "relative z-10 transition-colors duration-300",
                        isActive ? "text-white" : "text-zinc-600"
                      )}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-2xl border border-white/10 border-t-white/30"
                    />
                  )}
                </motion.div>

                <div className="text-center">
                  <motion.div
                    animate={{
                      color: isActive
                        ? "#ffffff"
                        : isDone
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.2)",
                    }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    {step.phase}
                  </motion.div>
                </div>
              </motion.div>

              {/* Connector */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-px relative hidden sm:block">
                  <div className="absolute inset-0 bg-white/[0.06]" />
                  <motion.div
                    animate={{
                      width: isDone ? "100%" : isActive ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-0 h-full bg-white/30"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main visualization card */}
      <div className="relative bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50">
        {/* Window chrome */}
        <div className="h-10 border-b border-white/[0.06] bg-white/[0.02] flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-500",
                activePhase > 0 ? "bg-white animate-pulse" : "bg-zinc-700"
              )}
            />
            <span className="text-[10px] font-mono text-zinc-500">
              {activePhase === 0
                ? "Ready"
                : activePhase === 1
                ? "Listening..."
                : activePhase === 2
                ? "Processing..."
                : activePhase === 3
                ? "Executing..."
                : "Complete"}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="min-h-[420px] p-6 md:p-10 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ─── PHASE 1: COMMAND ─────────────────────────── */}
            {activePhase === 1 && (
              <motion.div
                key="phase1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Terminal size={14} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Input
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-lg">
                    {/* Input field */}
                    <div
                      className={cn(
                        "bg-[#0A0A0A] border rounded-xl px-5 py-4 transition-all duration-500",
                        hasAi
                          ? "border-white/20 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                          : "border-white/[0.08]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-zinc-600">
                          <MessageSquare size={18} />
                        </div>
                        <div className="flex-1 relative">
                          <div className="text-sm font-medium min-h-[20px] flex items-center">
                            {inputText ? (
                              <span>
                                {inputText.includes("@ai") ? (
                                  <>
                                    <span className="text-white bg-white/10 px-1.5 py-0.5 rounded font-semibold">
                                      @ai
                                    </span>
                                    <span className="text-zinc-300">
                                      {inputText.replace("@ai", "")}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-zinc-300">
                                    {inputText}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-zinc-600">
                                Type a command...
                              </span>
                            )}
                            {cursorVisible && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                }}
                                className="inline-block w-0.5 h-5 bg-white ml-0.5 -mb-0.5"
                              />
                            )}
                          </div>
                        </div>
                        <motion.div
                          animate={{
                            scale: isSent ? [1, 1.3, 0] : inputText ? 1 : 0.9,
                            opacity: isSent ? [1, 1, 0] : inputText ? 1 : 0.3,
                          }}
                          transition={{ duration: isSent ? 0.4 : 0.2 }}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            inputText
                              ? "bg-white text-black"
                              : "bg-white/5 text-zinc-600"
                          )}
                        >
                          <Send
                            size={14}
                            className={inputText ? "fill-black" : ""}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Sent message preview */}
                    <AnimatePresence>
                      {isSent && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="mt-4 flex justify-end"
                        >
                          <div className="bg-white text-black rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-xs">
                            <span className="font-semibold">@ai</span> send a
                            project update to the team
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 2: PROCESS ─────────────────────────── */}
            {activePhase === 2 && (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Cpu size={14} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Processing Pipeline
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6 max-w-lg mx-auto w-full">
                  {/* Tokenization */}
                  <div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3 font-bold">
                      1. Tokenization
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tokens.map((token, i) => (
                        <motion.span
                          key={token}
                          initial={{ opacity: 0, scale: 0.5, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: i * 0.1,
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-mono border",
                            token === "@ai"
                              ? "bg-white/10 border-white/20 text-white font-bold"
                              : "bg-white/[0.03] border-white/[0.08] text-zinc-400"
                          )}
                        >
                          {token}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Intent */}
                  <AnimatePresence>
                    {intent && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3 font-bold">
                          2. Intent Classification
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-lg p-4 flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 2,
                              repeat: 2,
                              ease: "linear",
                            }}
                          >
                            <Radar size={16} className="text-white" />
                          </motion.div>
                          <span className="text-sm font-mono text-white">
                            {intent}
                          </span>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            transition={{ delay: 0.3 }}
                          >
                            <span className="text-[10px] bg-white/10 text-zinc-300 px-2 py-0.5 rounded ml-auto">
                              confidence: 0.97
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Route */}
                  <AnimatePresence>
                    {route && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3 font-bold">
                          3. Route Resolution
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-lg p-4 flex items-center gap-3">
                          <GitBranch size={16} className="text-zinc-400" />
                          <span className="text-sm text-zinc-300">{route}</span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.3,
                              type: "spring",
                              stiffness: 400,
                            }}
                          >
                            <CheckCircle2
                              size={16}
                              className="text-white ml-auto"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 3: EXECUTE ─────────────────────────── */}
            {activePhase === 3 && (
              <motion.div
                key="phase3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={14} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Execution
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-md space-y-3">
                    {tasks.map((task, i) => (
                      <motion.div
                        key={task.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all duration-500",
                          task.status === "done"
                            ? "bg-white/[0.05] border-white/[0.15]"
                            : task.status === "running"
                            ? "bg-white/[0.03] border-white/[0.12]"
                            : "bg-white/[0.01] border-white/[0.06]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {task.status === "done" ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 25,
                              }}
                            >
                              <CheckCircle2
                                size={18}
                                className="text-white"
                              />
                            </motion.div>
                          ) : task.status === "running" ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <RotateCw size={18} className="text-white/70" />
                            </motion.div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border border-white/10" />
                          )}
                          <span
                            className={cn(
                              "text-sm font-medium transition-colors duration-300",
                              task.status === "done"
                                ? "text-white"
                                : task.status === "running"
                                ? "text-zinc-300"
                                : "text-zinc-600"
                            )}
                          >
                            {task.name}
                          </span>
                        </div>

                        <span
                          className={cn(
                            "text-[10px] font-mono transition-colors duration-300",
                            task.status === "done"
                              ? "text-white/60"
                              : task.status === "running"
                              ? "text-zinc-400"
                              : "text-zinc-700"
                          )}
                        >
                          {task.status === "done"
                            ? "✓ done"
                            : task.status === "running"
                            ? "running..."
                            : "queued"}
                        </span>
                      </motion.div>
                    ))}

                    {/* Progress */}
                    {tasks.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-2"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            Progress
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {tasks.filter((t) => t.status === "done").length}/
                            {tasks.length}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            animate={{
                              width: `${
                                (tasks.filter((t) => t.status === "done")
                                  .length /
                                  tasks.length) *
                                100
                              }%`,
                            }}
                            transition={{ duration: 0.4 }}
                            className="h-full bg-white/30 rounded-full"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 4: CONFIRM ─────────────────────────── */}
            {activePhase === 4 && (
              <motion.div
                key="phase4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 size={14} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Results
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    {/* Result card */}
                    <div className="bg-[#0A0A0A] border border-white/[0.1] rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          <Sparkles size={16} className="text-black" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            AI Assistant
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            Task completed
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {resultLines.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: i * 0.15,
                              duration: 0.4,
                            }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-sm text-zinc-300 leading-relaxed">
                              {line}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Confirmed badge */}
                      <AnimatePresence>
                        {isConfirmed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                            className="mt-6 pt-4 border-t border-white/[0.06]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: 2,
                                  }}
                                >
                                  <CheckCircle2
                                    size={20}
                                    className="text-white"
                                  />
                                </motion.div>
                                <span className="text-sm font-semibold text-white">
                                  All tasks confirmed
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500">
                                14ms total
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Idle state */}
            {activePhase === 0 && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 mx-auto mb-4 border border-white/10 rounded-2xl flex items-center justify-center bg-white/[0.02]"
                  >
                    <Workflow size={28} className="text-zinc-600" />
                  </motion.div>
                  <p className="text-zinc-600 text-sm">
                    Initializing workflow...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN FLOW COMPONENT ────────────────────────────────────────────────────
const Flow = () => {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[-5%] w-[500px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full" />
        <div className="absolute bottom-[15%] right-[-5%] w-[400px] h-[400px] bg-white/[0.015] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HEADER + WORKFLOW ANIMATION
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm mb-8"
        >
          <Workflow size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            How It Works
          </span>
        </motion.div>

        <div className="space-y-4 text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white leading-[0.95] tracking-tight"
          >
            Four steps.
            <br />
            <span className="text-white/40">Zero friction.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 leading-relaxed font-light"
          >
            From natural language command to confirmed result — watch every step
            of the pipeline in real-time.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <WorkflowVisualization />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — STEP DETAIL CARDS (4 Steps)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-10">
        <div className="w-full h-px bg-white/[0.06]" />

        <div className="grid grid-cols-1 md:grid-cols-4 w-full">
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <SpotlightCard
                key={step.id}
                delay={0.1 + i * 0.1}
                className={cn(
                  "border-b md:border-b-0",
                  i < FLOW_STEPS.length - 1
                    ? "md:border-r border-white/[0.06]"
                    : ""
                )}
              >
                <div className="p-8 md:p-8 min-h-[400px] flex flex-col justify-between relative z-10">
                  <div>
                    {/* Step number */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 mb-6"
                    >
                      <div className="w-10 h-10 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                        Step {step.id}
                      </span>
                    </motion.div>

                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-2">
                      {step.phase}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4 font-medium">
                      {step.subtitle}
                    </p>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Unique visual per step */}
                    {step.id === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-zinc-400">$</span>
                          <span className="text-white font-mono">
                            @ai
                          </span>
                          <span className="text-zinc-500 font-mono">
                            your command here
                          </span>
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                            className="w-0.5 h-3.5 bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {step.id === 2 && (
                      <div className="space-y-2">
                        {["Tokenize", "Classify", "Route"].map((s, j) => (
                          <motion.div
                            key={s}
                            initial={{ opacity: 0, width: 0 }}
                            whileInView={{ opacity: 1, width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + j * 0.15 }}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[10px] text-zinc-600 w-14 shrink-0">
                              {s}
                            </span>
                            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{
                                  width: `${100 - j * 15}%`,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: 0.6 + j * 0.2,
                                  duration: 1,
                                }}
                                className="h-full bg-white/20 rounded-full"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: Globe, label: "APIs" },
                          { icon: Layers, label: "Services" },
                          { icon: CircuitBoard, label: "Workers" },
                          { icon: Shield, label: "Verify" },
                        ].map(({ icon: I, label }, j) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + j * 0.1 }}
                            className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5"
                          >
                            <I size={12} className="text-zinc-500" />
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {step.id === 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-3 space-y-1.5"
                      >
                        {["✓ Action completed", "✓ Status: verified", "✓ Latency: 14ms"].map(
                          (line, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6 + j * 0.15 }}
                              className="text-xs text-zinc-400"
                            >
                              {line}
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="pt-4 border-t border-white/[0.04] mt-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">
                        {step.id === 1 && <AnimatedCounter target={100} suffix="+" />}
                        {step.id === 2 && (
                          <AnimatedCounter prefix="<" target={50} suffix="ms" />
                        )}
                        {step.id === 3 && (
                          <AnimatedCounter target={99} suffix=".9%" />
                        )}
                        {step.id === 4 && (
                          <AnimatedCounter target={14} suffix="ms" />
                        )}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wider">
                        {step.id === 1 && "Commands"}
                        {step.id === 2 && "Parse Time"}
                        {step.id === 3 && "Success Rate"}
                        {step.id === 4 && "Avg Delivery"}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        <div className="w-full h-px bg-white/[0.06]" />
      </div>
    </section>
  );
};

export default Flow;
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Shield,
  Lock,
  Fingerprint,
  Eye,
  EyeOff,
  Key,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  FileKey,
  UserCheck,
  HardDrive,
  Binary,
  Layers,
  Globe,
  AlertTriangle,
  Hash,
  RefreshCw,
  Workflow,
  ChevronRight,
  ArrowUpRight,
  Cpu,
  Network,
  ScanFace,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── ANIMATION SCRIPT ───────────────────────────────────────────────────────
type AnimStep =
  | { type: "phase"; phase: number }
  | { type: "msg"; text: string }
  | { type: "encrypt"; chars: string }
  | { type: "key"; label: string }
  | { type: "tunnel"; progress: number }
  | { type: "decrypt"; text: string }
  | { type: "store"; items: { label: string; encrypted: boolean }[] }
  | { type: "verify"; step: string; status: "pending" | "checking" | "passed" }
  | { type: "shield"; active: boolean }
  | { type: "confirmed" }
  | { type: "delay"; ms: number }
  | { type: "reset" };

const ANIM_SCRIPT: AnimStep[] = [
  // Phase 1: Message Input
  { type: "phase", phase: 1 },
  { type: "delay", ms: 500 },
  { type: "msg", text: "Hey team, the API keys are ready 🔑" },
  { type: "delay", ms: 1200 },

  // Phase 2: Encryption
  { type: "phase", phase: 2 },
  { type: "delay", ms: 400 },
  { type: "key", label: "AES-256-GCM" },
  { type: "delay", ms: 600 },
  { type: "encrypt", chars: "0x7f3a...9bc2e1d4" },
  { type: "delay", ms: 800 },
  { type: "tunnel", progress: 25 },
  { type: "delay", ms: 300 },
  { type: "tunnel", progress: 50 },
  { type: "delay", ms: 300 },
  { type: "tunnel", progress: 75 },
  { type: "delay", ms: 300 },
  { type: "tunnel", progress: 100 },
  { type: "delay", ms: 600 },

  // Phase 3: Storage
  { type: "phase", phase: 3 },
  { type: "delay", ms: 400 },
  {
    type: "store",
    items: [
      { label: "Message body", encrypted: true },
      { label: "Sender identity", encrypted: true },
      { label: "Attachments", encrypted: true },
      { label: "Metadata", encrypted: true },
    ],
  },
  { type: "delay", ms: 1800 },

  // Phase 4: Verification
  { type: "phase", phase: 4 },
  { type: "delay", ms: 400 },
  { type: "verify", step: "Signature verification", status: "checking" },
  { type: "delay", ms: 700 },
  { type: "verify", step: "Signature verification", status: "passed" },
  { type: "delay", ms: 300 },
  { type: "verify", step: "Integrity check", status: "checking" },
  { type: "delay", ms: 600 },
  { type: "verify", step: "Integrity check", status: "passed" },
  { type: "delay", ms: 300 },
  { type: "verify", step: "Recipient auth", status: "checking" },
  { type: "delay", ms: 500 },
  { type: "verify", step: "Recipient auth", status: "passed" },
  { type: "delay", ms: 500 },
  { type: "decrypt", text: "Hey team, the API keys are ready 🔑" },
  { type: "delay", ms: 600 },
  { type: "shield", active: true },
  { type: "delay", ms: 400 },
  { type: "confirmed" },
  { type: "delay", ms: 3000 },
  { type: "reset" },
];

// ─── ENCRYPTION VISUALIZATION ───────────────────────────────────────────────
const EncryptionVisualization = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [message, setMessage] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [keyLabel, setKeyLabel] = useState("");
  const [tunnelProgress, setTunnelProgress] = useState(0);
  const [decryptedText, setDecryptedText] = useState("");
  const [storeItems, setStoreItems] = useState<
    { label: string; encrypted: boolean; animDone?: boolean }[]
  >([]);
  const [verifySteps, setVerifySteps] = useState<
    { step: string; status: "pending" | "checking" | "passed" }[]
  >([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const resetAll = () => {
      setActivePhase(0);
      setMessage("");
      setEncryptedText("");
      setKeyLabel("");
      setTunnelProgress(0);
      setDecryptedText("");
      setStoreItems([]);
      setVerifySteps([]);
      setShieldActive(false);
      setIsConfirmed(false);
    };

    const runScript = () => {
      if (cancelled) return;
      resetAll();

      let currentTime = 0;

      ANIM_SCRIPT.forEach((step) => {
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
            case "msg":
              setMessage(step.text);
              break;
            case "encrypt":
              setEncryptedText(step.chars);
              break;
            case "key":
              setKeyLabel(step.label);
              break;
            case "tunnel":
              setTunnelProgress(step.progress);
              break;
            case "decrypt":
              setDecryptedText(step.text);
              break;
            case "store":
              setStoreItems(step.items.map((i) => ({ ...i, animDone: false })));
              // Animate each item
              step.items.forEach((_, idx) => {
                const stid = setTimeout(() => {
                  if (cancelled) return;
                  setStoreItems((prev) =>
                    prev.map((item, j) =>
                      j === idx ? { ...item, animDone: true } : item
                    )
                  );
                }, 300 + idx * 350);
                timeoutIds.push(stid);
              });
              break;
            case "verify":
              setVerifySteps((prev) => {
                const existing = prev.findIndex((v) => v.step === step.step);
                if (existing >= 0) {
                  const next = [...prev];
                  next[existing] = { step: step.step, status: step.status };
                  return next;
                }
                return [...prev, { step: step.step, status: step.status }];
              });
              break;
            case "shield":
              setShieldActive(step.active);
              break;
            case "confirmed":
              setIsConfirmed(true);
              break;
            case "reset":
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
  }, [isInView]);

  const PHASES = [
    { id: 1, label: "COMPOSE", icon: FileKey },
    { id: 2, label: "ENCRYPT", icon: Lock },
    { id: 3, label: "STORE", icon: Database },
    { id: 4, label: "DELIVER", icon: ShieldCheck },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {/* Phase indicators */}
      <div className="flex items-center justify-between mb-12 px-4">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = activePhase === phase.id;
          const isDone = activePhase > phase.id;
          return (
            <React.Fragment key={phase.id}>
              <motion.div className="flex flex-col items-center gap-2">
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
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-2xl border border-white/10 border-t-white/30"
                    />
                  )}
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <CheckCircle2 size={22} className="text-white" />
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
                </motion.div>
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
                  {phase.label}
                </motion.div>
              </motion.div>

              {i < PHASES.length - 1 && (
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

      {/* Main visualization */}
      <div className="relative bg-[#050505] rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50">
        {/* Window chrome */}
        <div className="h-10 border-b border-white/[0.06] bg-white/[0.02] flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
          </div>
          <div className="flex items-center gap-2">
            <Shield
              size={12}
              className={cn(
                "transition-colors duration-300",
                shieldActive ? "text-white" : "text-zinc-600"
              )}
            />
            <span className="text-[10px] font-mono text-zinc-500">
              {activePhase === 0
                ? "Idle"
                : activePhase === 1
                ? "Composing..."
                : activePhase === 2
                ? "Encrypting..."
                : activePhase === 3
                ? "Storing..."
                : "Delivering..."}
            </span>
          </div>
        </div>

        <div className="min-h-[480px] p-6 md:p-10 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ─── PHASE 1: MESSAGE INPUT ─────────────────── */}
            {activePhase === 1 && (
              <motion.div
                key="p1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <FileKey size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      Plaintext Message
                    </span>
                  </div>

                  {/* User avatar + message */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
                      <UserCheck size={18} className="text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-white">
                          You
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          Just now
                        </span>
                      </div>
                      <AnimatePresence>
                        {message && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white text-black rounded-2xl rounded-tl-sm px-5 py-3 text-sm"
                          >
                            {message}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Warning indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex items-center gap-2 text-[11px] text-zinc-500 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2.5"
                  >
                    <AlertTriangle size={12} className="text-zinc-500" />
                    <span>
                      Message readable — encryption not yet applied
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 2: ENCRYPTION ───────────────────── */}
            {activePhase === 2 && (
              <motion.div
                key="p2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-lg space-y-6">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      Encryption Pipeline
                    </span>
                  </div>

                  {/* Key generation */}
                  <AnimatePresence>
                    {keyLabel && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0A0A0A] border border-white/[0.08] rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 2,
                              repeat: 2,
                              ease: "linear",
                            }}
                          >
                            <Key size={16} className="text-white" />
                          </motion.div>
                          <div>
                            <div className="text-xs text-white font-medium">
                              Encryption Key Generated
                            </div>
                            <div className="text-[10px] text-zinc-600 font-mono">
                              {keyLabel} · 256-bit
                            </div>
                          </div>
                        </div>

                        {/* Key visualization */}
                        <div className="flex gap-1">
                          {Array.from({ length: 32 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scaleY: 0 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              transition={{ delay: i * 0.02 }}
                              className="flex-1 h-6 bg-white/[0.06] rounded-sm"
                              style={{
                                height: `${12 + Math.random() * 16}px`,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Plaintext → Ciphertext */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                    <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-lg p-4">
                      <div className="text-[10px] text-zinc-600 mb-2 uppercase tracking-wider font-bold">
                        Plaintext
                      </div>
                      <div className="text-xs text-zinc-400 font-mono break-all leading-relaxed">
                        {message || "..."}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-center">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight size={18} className="text-zinc-600" />
                      </motion.div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/[0.1] rounded-lg p-4">
                      <div className="text-[10px] text-zinc-600 mb-2 uppercase tracking-wider font-bold">
                        Ciphertext
                      </div>
                      <AnimatePresence>
                        {encryptedText && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-white/40 font-mono break-all leading-relaxed"
                          >
                            {encryptedText}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Tunnel progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
                        Secure Tunnel
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {tunnelProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${tunnelProgress}%` }}
                        transition={{ duration: 0.4 }}
                        className="h-full bg-gradient-to-r from-white/10 to-white/30 rounded-full relative"
                      >
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 3: STORAGE ──────────────────────── */}
            {activePhase === 3 && (
              <motion.div
                key="p3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-lg space-y-6">
                  <div className="flex items-center gap-2">
                    <Database size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      Encrypted Storage
                    </span>
                  </div>

                  {/* Server visualization */}
                  <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                        <Server size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          Encrypted Vault
                        </div>
                        <div className="text-[10px] text-zinc-600">
                          Zero-knowledge storage · Region: Auto
                        </div>
                      </div>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-auto w-2 h-2 rounded-full bg-white"
                      />
                    </div>

                    <div className="space-y-2.5">
                      {storeItems.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all duration-500",
                            item.animDone
                              ? "bg-white/[0.04] border-white/[0.12]"
                              : "bg-white/[0.01] border-white/[0.06]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.animDone ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25,
                                }}
                              >
                                <Lock size={14} className="text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <RefreshCw
                                  size={14}
                                  className="text-zinc-500"
                                />
                              </motion.div>
                            )}
                            <span
                              className={cn(
                                "text-sm transition-colors duration-300",
                                item.animDone ? "text-white" : "text-zinc-500"
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-mono transition-colors duration-300",
                              item.animDone ? "text-white/50" : "text-zinc-700"
                            )}
                          >
                            {item.animDone ? "encrypted" : "encrypting..."}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Data residency */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between text-[11px] text-zinc-600 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={12} />
                      <span>Data residency: Auto-selected</span>
                    </div>
                    <span className="font-mono text-zinc-500">
                      eu-west-1
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─── PHASE 4: VERIFICATION + DELIVERY ──────── */}
            {activePhase === 4 && (
              <motion.div
                key="p4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-lg space-y-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                      Verification & Delivery
                    </span>
                  </div>

                  {/* Verify steps */}
                  <div className="space-y-2.5">
                    {verifySteps.map((v, i) => (
                      <motion.div
                        key={v.step}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-lg border transition-all duration-500",
                          v.status === "passed"
                            ? "bg-white/[0.05] border-white/[0.15]"
                            : "bg-white/[0.02] border-white/[0.08]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {v.status === "passed" ? (
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
                          ) : (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <RefreshCw
                                size={18}
                                className="text-zinc-500"
                              />
                            </motion.div>
                          )}
                          <span
                            className={cn(
                              "text-sm font-medium",
                              v.status === "passed"
                                ? "text-white"
                                : "text-zinc-400"
                            )}
                          >
                            {v.step}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-mono",
                            v.status === "passed"
                              ? "text-white/50"
                              : "text-zinc-600"
                          )}
                        >
                          {v.status === "passed" ? "✓ passed" : "checking..."}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decrypted message */}
                  <AnimatePresence>
                    {decryptedText && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-[#0A0A0A] border border-white/[0.12] rounded-xl p-5"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <EyeOff size={12} className="text-zinc-500" />
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                            Decrypted for recipient only
                          </span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-sm text-white">
                          {decryptedText}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shield + confirmed */}
                  <AnimatePresence>
                    {isConfirmed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="flex items-center justify-between bg-white/[0.04] border border-white/[0.1] rounded-lg px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 0.6, repeat: 2 }}
                          >
                            <ShieldCheck size={20} className="text-white" />
                          </motion.div>
                          <span className="text-sm font-semibold text-white">
                            End-to-end encrypted delivery
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          14ms
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* IDLE */}
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
                    <Shield size={28} className="text-zinc-600" />
                  </motion.div>
                  <p className="text-zinc-600 text-sm">
                    Initializing security protocol...
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

// ─── MAIN SECURITY COMPONENT ────────────────────────────────────────────────
const Security = () => {
  return (
    <section className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-8%] w-[500px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full" />
        <div className="absolute bottom-[15%] right-[-8%] w-[400px] h-[400px] bg-white/[0.015] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HEADER + ENCRYPTION ANIMATION
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm mb-8"
        >
          <Shield size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            Security
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
            Encrypted by default.
            <br />
            <span className="text-white/40">Visible to no one.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 leading-relaxed font-light"
          >
            Every message, every file, every profile — encrypted end-to-end
            before it leaves your device. Not even we can read it.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <EncryptionVisualization />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2 — 3 VERTICAL INFO CARDS
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative z-10">
        <div className="w-full h-px bg-white/[0.06]" />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {/* Card 1: E2E Encryption */}
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
                  <Lock className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  End-to-End Encryption
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Messages are encrypted on your device using the Signal Protocol
                  with AES-256-GCM. Decryption happens only on the
                  recipient&apos;s device. The server never sees plaintext.
                </p>

                {/* Encryption flow visualization */}
                <div className="space-y-4">
                  {[
                    { from: "Plaintext", to: "Encrypted", icon: Lock },
                    { from: "In Transit", to: "Protected", icon: Shield },
                    { from: "At Rest", to: "Sealed", icon: HardDrive },
                  ].map((item, i) => (
                    <motion.div
                      key={item.from}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                      className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3"
                    >
                      <item.icon size={14} className="text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-500 w-16 shrink-0">
                        {item.from}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.08] relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                          className="absolute inset-y-0 left-0 bg-white/20"
                        />
                      </div>
                      <span className="text-xs text-white font-medium w-16 text-right shrink-0">
                        {item.to}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Protocol badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {["Signal Protocol", "AES-256", "ECDH", "HMAC-SHA256"].map(
                    (proto, i) => (
                      <motion.span
                        key={proto}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.85 + i * 0.08 }}
                        className="text-[10px] text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-md font-mono"
                      >
                        {proto}
                      </motion.span>
                    )
                  )}
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
                    <AnimatedCounter target={256} />
                    -bit
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Encryption
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 2: Message Storage */}
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
                  <Database className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Zero-Knowledge Storage
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  Messages are stored as encrypted blobs. No server-side
                  decryption keys exist. Even with full database access,
                  your data remains unreadable.
                </p>

                {/* Storage visualization */}
                <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-5 mb-6">
                  <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-4 font-bold">
                    Data at Rest
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Messages",
                        encrypted: true,
                        bar: "100%",
                      },
                      {
                        label: "Attachments",
                        encrypted: true,
                        bar: "100%",
                      },
                      {
                        label: "User Profiles",
                        encrypted: true,
                        bar: "100%",
                      },
                      {
                        label: "Metadata",
                        encrypted: true,
                        bar: "100%",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs text-zinc-400 flex items-center gap-2">
                            <Lock size={10} className="text-zinc-600" />
                            {item.label}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            encrypted
                          </span>
                        </div>
                        <AnimatedBar
                          width={item.bar}
                          delay={0.5 + i * 0.12}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Readable by nobody */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-3 text-[11px]"
                >
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Eye size={12} />
                    <span>Server-side visibility:</span>
                  </div>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <XCircle size={12} className="text-zinc-400" />
                    None
                  </span>
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
                    <AnimatedCounter target={100} suffix="%" />
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Encrypted at Rest
                  </span>
                </div>
              </motion.div>
            </div>
          </SpotlightCard>

          {/* Card 3: User Profile Security */}
          <SpotlightCard delay={0.3}>
            <div className="p-8 md:p-10 min-h-[520px] flex flex-col justify-between relative z-10">
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="w-12 h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center mb-6"
                >
                  <ScanFace className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  Profile Protection
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                  User profiles, contact lists, and preferences are encrypted
                  client-side. Multi-factor authentication and biometric locks
                  add additional layers of defense.
                </p>

                {/* Profile security layers */}
                <div className="relative space-y-3">
                  {[
                    {
                      icon: Fingerprint,
                      label: "Biometric Lock",
                      detail: "Face ID / Fingerprint",
                    },
                    {
                      icon: Key,
                      label: "MFA Enabled",
                      detail: "TOTP + Hardware Keys",
                    },
                    {
                      icon: Shield,
                      label: "Session Encryption",
                      detail: "Per-device keys",
                    },
                    {
                      icon: Binary,
                      label: "Profile Data",
                      detail: "Client-side encrypted",
                    },
                  ].map((layer, i) => (
                    <motion.div
                      key={layer.label}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.12 }}
                      className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:border-white/[0.12] transition-colors cursor-default"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                        <layer.icon size={14} className="text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white font-medium">
                          {layer.label}
                        </div>
                        <div className="text-[10px] text-zinc-600">
                          {layer.detail}
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.7 + i * 0.12,
                          type: "spring",
                          stiffness: 400,
                        }}
                      >
                        <CheckCircle2 size={14} className="text-white/40" />
                      </motion.div>
                    </motion.div>
                  ))}

                  {/* Connection line */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="absolute left-[23px] top-[20px] w-px h-[calc(100%-40px)] bg-gradient-to-b from-white/15 via-white/10 to-transparent origin-top pointer-events-none"
                  />
                </div>

                {/* Compliance badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="flex flex-wrap gap-2 mt-6"
                >
                  {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map(
                    (badge, i) => (
                      <motion.span
                        key={badge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.05 + i * 0.08 }}
                        className="text-[10px] text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-md font-medium"
                      >
                        {badge}
                      </motion.span>
                    )
                  )}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 }}
                className="pt-6 border-t border-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    <AnimatedCounter target={4} />
                    {" "}Layers
                  </span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    Defense Depth
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

export default Security;
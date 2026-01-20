"use client";
import { motion } from "framer-motion";
import { MessageSquare, Calendar, Brain, Shield, Zap, Layers } from "lucide-react";

const features = [
  {
    title: "Core Messaging",
    desc: "Real-time socket-based chat and group creation with zero latency.",
    icon: MessageSquare,
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    title: "Smart Processing",
    desc: "Auto-summarization and intent detection for every conversation.",
    icon: Brain,
    colSpan: "col-span-1",
  },
  {
    title: "Workflow Integration",
    desc: "Direct connection to Google Calendar, Notion, and Gmail.",
    icon: Calendar,
    colSpan: "col-span-1",
  },
  {
    title: "Enterprise Security",
    desc: "End-to-end encryption and secure authentication flows.",
    icon: Shield,
    colSpan: "col-span-1 md:col-span-2",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-3xl md:text-5xl font-bold mb-16 text-center"
        >
          Beyond simple chat.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`${item.colSpan} p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group cursor-default`}
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
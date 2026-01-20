"use client";
import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Command", desc: "User inputs natural language request." },
  { num: "02", title: "Process", desc: "AI extracts intent and plans actions." },
  { num: "03", title: "Execute", desc: "Agent connects to APIs (Notion, Cal)." },
  { num: "04", title: "Confirm", desc: "Summary report generated in chat." },
];

export default function Workflow() {
  return (
    <section className="py-32 px-4 bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">System Overview</h2>
          <p className="text-secondary">From text input to automated action.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-white/10 md:left-1/2 md:-ml-[1px]" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 text-center md:text-left">
                    <div className={`${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-secondary">{step.desc}</p>
                    </div>
                </div>
                
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black font-bold ring-4 ring-black">
                  {step.num}
                </div>

                <div className="flex-1" /> {/* Spacer for alignment */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
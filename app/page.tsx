import Hero from "@/components/Hero";
import Features from "@/components/Features";
//import Workflow from "@/components/ui/Workflow";
import WorkflowEnd from "@/components/Workflow-end";
import Integrations from "@/components/Integration";
import Detection from "@/components/Detection";
import Flow from "@/components/Flow";
import Security from "@/components/Security";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* We removed the <nav> here because it is now built into Hero.tsx */}
      
      <Hero />
      <Features />
      {/* <Workflow /> */}
      {/* <WorkflowEnd /> */}
      <Detection />
      <Integrations />
      <Flow />
      <Security />
      
      <footer className="py-12 text-center text-secondary text-sm border-t border-white/5">
        <p>© 2026 BetterChat. All systems nominal.</p>
      </footer>
    </main>
  );
}
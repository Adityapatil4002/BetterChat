import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="font-bold text-xl tracking-tighter">BetterChat.</div>
        <nav className="hidden md:flex gap-6 text-sm text-secondary">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Workflow</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </div>

      <Hero />
      <Features />
      <Workflow />
      
      <footer className="py-12 text-center text-secondary text-sm border-t border-white/5">
        <p>© 2026 BetterChat. All systems nominal.</p>
      </footer>
    </main>
  );
}
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BriefcaseIcon, 
  ChartLineUpIcon, 
  LayoutIcon, 
  PlusIcon,
  CheckCircleIcon
} from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="size-9 relative transition-transform group-hover:scale-110">
              <Image 
                src="/favicon.ico" 
                alt="jules.io logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">jules.io</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
            <a href="#stats" className="hover:text-primary transition-colors relative group">
              Performance
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
            <a href="#about" className="hover:text-primary transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
            <Button asChild variant="ghost" className="hidden sm:flex font-bold text-xs uppercase tracking-widest">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="shadow-[0_0_20px_rgba(var(--primary),0.3)] font-bold text-xs uppercase tracking-widest px-6">
              <Link href="/signup">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-40 overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Engineering Preview v1.0
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                DATA-DRIVEN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/40">ORCHESTRATION.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                The high-performance workspace for technical teams. Track every millisecond 
                of progress with industrial-grade analytics and project isolation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Button asChild size="lg" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                  <Link href="/signup">Deploy Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] hover:bg-primary/5 transition-colors">
                  <Link href="/login">View Architecture</Link>
                </Button>
              </div>
            </div>

            {/* Premium Mockup Component */}
            <div className="mt-24 relative max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
              <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-background to-transparent z-10" />
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-2xl p-3 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                  <div className="rounded-xl border bg-background/50 overflow-hidden aspect-[21/9] flex flex-col">
                    {/* Mockup Top Bar */}
                    <div className="h-10 border-b bg-muted/30 flex items-center px-4 gap-4">
                      <div className="flex gap-1.5">
                        <div className="size-2.5 rounded-full bg-red-500/20" />
                        <div className="size-2.5 rounded-full bg-yellow-500/20" />
                        <div className="size-2.5 rounded-full bg-green-500/20" />
                      </div>
                      <div className="h-4 w-64 bg-muted/50 rounded-full mx-auto" />
                    </div>
                    
                    {/* Mockup Body */}
                    <div className="flex-1 flex items-center justify-center relative p-12">
                      <div className="flex flex-col items-center gap-6 text-muted-foreground/50">
                        <LayoutIcon className="size-20 stroke-[0.5]" />
                        <div className="space-y-2 text-center">
                          <p className="font-black tracking-[0.4em] uppercase text-[10px]">Production Interface</p>
                          <p className="text-xs italic opacity-50">Rendering interactive dashboard components...</p>
                        </div>
                      </div>
                      
                      {/* Floating UI Elements */}
                      <div className="absolute top-10 right-10 w-48 h-32 rounded-lg border bg-background/80 shadow-lg p-4 animate-bounce-slow">
                        <div className="size-8 rounded-full bg-primary/10 mb-4" />
                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                        <div className="h-2 w-2/3 bg-muted rounded-full" />
                      </div>
                      <div className="absolute bottom-10 left-10 w-56 h-40 rounded-lg border bg-background/80 shadow-lg p-6 animate-pulse-slow">
                        <ChartLineUpIcon className="size-10 text-primary mb-4" />
                        <div className="space-y-3">
                          <div className="h-2 w-full bg-primary/20 rounded-full" />
                          <div className="h-2 w-full bg-primary/20 rounded-full" />
                          <div className="h-2 w-4/5 bg-primary/20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="max-w-xl space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
                  Architected for <br />
                  <span className="text-primary">Performance.</span>
                </h2>
                <p className="text-muted-foreground font-medium">
                  We stripped away the fluff and focused on what matters: execution, 
                  visibility, and industrial reliability.
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Latest Deployment: Stable 1.0.4
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border rounded-3xl overflow-hidden shadow-2xl">
              {[
                {
                  title: "Task Isolation",
                  desc: "Zero-latency task tracking with state-persistent data structures.",
                  icon: CheckCircleIcon,
                  tag: "Core"
                },
                {
                  title: "Weighted Ranking",
                  desc: "Fair performance scoring based on priority, difficulty, and timeliness.",
                  icon: ChartLineUpIcon,
                  tag: "Analytics"
                },
                {
                  title: "Team Permissions",
                  desc: "Granular RBAC controls for enterprise-grade project security.",
                  icon: BriefcaseIcon,
                  tag: "Security"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 bg-background hover:bg-muted/50 transition-colors relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 size-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                    <feature.icon className="size-full" />
                  </div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <feature.icon className="size-6" />
                    </div>
                    <Badge variant="outline" className="opacity-50">{feature.tag}</Badge>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom Section */}
        <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--background)_0%,_transparent_100%)] opacity-10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                EXECUTION <br />
                STARTS HERE.
              </h2>
              <p className="text-xl text-primary-foreground/70 max-w-xl mx-auto font-medium italic">
                "The most efficient task manager I've ever deployed." — Tech Lead, jules.io
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Button asChild size="lg" variant="secondary" className="h-16 px-12 text-xs font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform">
                  <Link href="/signup">Provision Workspace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-20">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="size-7 bg-primary rounded-lg flex items-center justify-center">
                  <Image 
                    src="/favicon.ico" 
                    alt="jules.io logo" 
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="font-black uppercase tracking-widest text-lg">jules.io</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                A technical task orchestration platform for high-velocity engineering teams. 
                Optimized for performance, built with precision.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Product</h4>
                <ul className="space-y-2 text-xs font-bold text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Performance</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Resources</h4>
                <ul className="space-y-2 text-xs font-bold text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/50">
            <p>© 2026 jules.io Orchestration Labs. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-primary">Status: Operational</a>
              <a href="#" className="hover:text-primary">Privacy Protocol</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

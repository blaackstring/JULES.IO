import { SignupForm } from "@/components/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 font-mono relative overflow-hidden bg-background">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="size-10 relative transition-transform group-hover:scale-110">
              <Image 
                src="/favicon.ico" 
                alt="jules.io logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">jules.io</span>
          </Link>
          <div className="h-px w-12 bg-primary/20" />
        </div>

        <SignupForm className="animate-in fade-in zoom-in-95 duration-500" />
        
        <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-50">
          Global Identity Protocol v1.0
        </p>
      </div>
    </div>
  )
}

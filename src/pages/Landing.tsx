import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Gavel } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center relative overflow-hidden text-white font-sans selection:bg-primary/30">
            {/* Dynamic Animated Mesh Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-vanguard-blue/10 rounded-full blur-[160px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-vanguard-rose/10 rounded-full blur-[160px] animate-pulse-glow delay-1000" />
                <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-vanguard-emerald/5 rounded-full blur-[140px] animate-float opacity-50" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] mask-image-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Floating Hero Card */}
            <div className="relative z-10 w-full max-w-5xl px-6">
                <div className="glass-card-elevated border-white/5 bg-white/[0.02] backdrop-blur-[40px] rounded-[48px] p-12 md:p-24 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center text-center space-y-12 animate-float">
                    {/* Badge */}
                    <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black tracking-[0.3em] uppercase animate-in fade-in zoom-in duration-700">
                        Official 2026 Edition
                    </div>

                    {/* Logo/Icon with multi-layer glow */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-colors" />
                        <div className="relative w-28 h-28 bg-gradient-to-tr from-vanguard-blue via-primary to-vanguard-rose rounded-[32px] flex items-center justify-center shadow-2xl animate-scale-in">
                            <Gavel className="w-14 h-14 text-white drop-shadow-lg" />
                        </div>
                    </div>

                    {/* Hero Text */}
                    <div className="space-y-6 animate-slide-up">
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic leading-[0.8] drop-shadow-2xl">
                            CODING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">GITA</span>
                            <br />
                            <span className="text-primary drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">AUCTION</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium tracking-[0.3em] uppercase max-w-lg mx-auto leading-relaxed">
                            The premium arena for <span className="text-white">vanguard collectives</span>
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full max-w-xs">
                        <Button
                            onClick={() => navigate('/login')}
                            className="group relative w-full h-20 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                START AUCTION
                                <Play className="w-7 h-7 fill-current group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-vanguard-blue/30 via-transparent to-vanguard-rose/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </div>
                </div>

                {/* Floating Stats Orbs */}
                <div className="hidden lg:block">
                    <div className="absolute -top-10 -right-10 glass-card p-6 rounded-2xl border-white/10 animate-float delay-700 shadow-2xl">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xl font-black italic">PHASE 2026</p>
                    </div>
                    <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl border-white/10 animate-float delay-1000 shadow-2xl">
                        <p className="text-[10px] font-bold text-vanguard-rose uppercase tracking-widest mb-1">Series</p>
                        <p className="text-xl font-black italic">ELITE VANGUARD</p>
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-12 left-0 right-0 text-center flex flex-col items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Architecture v2.0.4</span>
            </div>
        </div>
    );
}

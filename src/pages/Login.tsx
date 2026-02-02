import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin@2026') {
            toast.success('Access Granted. Welcome Admin.');
            navigate('/auction'); // Note: We will swap root to Landing, and the main app to /auction
        } else {
            setError(true);
            toast.error('Incorrect Password');
            setPassword('');
        }
    };

    const handleForgot = () => {
        const subject = encodeURIComponent('Auction Portal Password Recovery');
        const body = encodeURIComponent('Hello,\n\nI need to recover the admin password for the Elite Auction Hub 2026.\n\nPlease verify my identity and resend the credentials.');
        window.open(`mailto:chitthirpara@gmail.com?subject=${subject}&body=${body}`);
    };

    return (
        <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Visual background noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vanguard-blue/10 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-md relative z-10 space-y-8 animate-scale-in">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter">SECURE ACCESS</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Verify Admin Credentials</p>
                </div>

                <form onSubmit={handleLogin} className="glass-card-elevated p-8 rounded-3xl space-y-6 border border-white/5 shadow-2xl">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                className={`h-14 bg-white/5 border-white/10 text-white text-lg rounded-xl pl-12 focus:ring-primary focus:border-primary transition-all ${error ? 'border-destructive/50 ring-1 ring-destructive/50 animate-shake' : ''}`}
                            />
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-xl glow-primary shadow-xl group transition-all"
                    >
                        ENTER SYSTEM
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleForgot}
                        className="w-full text-muted-foreground hover:text-white transition-colors text-xs font-bold tracking-widest uppercase py-2"
                    >
                        <Mail className="w-3.5 h-3.5 mr-2" />
                        Forgot Password?
                    </Button>
                </form>

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    End-to-End Encrypted Session
                </div>
            </div>
        </div>
    );
}

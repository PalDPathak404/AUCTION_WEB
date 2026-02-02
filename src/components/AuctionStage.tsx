import { Gavel, User, Hash, ChevronRight, AlertCircle, Clock, Play, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Student, Vanguard } from '@/types/auction';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuctionStageProps {
  currentStudent: Student | null;
  vanguards: Vanguard[];
  onSale: (studentId: string, vanguardId: string, price: number) => void;
  remainingCount: number;
  totalCount: number;
}

const BASE_PRICE = 0.25;
const TIMER_DURATION = 15;

export function AuctionStage({
  currentStudent,
  vanguards,
  onSale,
  remainingCount,
  totalCount,
}: AuctionStageProps) {
  const [bidAmount, setBidAmount] = useState(BASE_PRICE);
  const [selectedVanguard, setSelectedVanguard] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showSoldOverlay, setShowSoldOverlay] = useState(false);
  const [soldDetails, setSoldDetails] = useState<{ name: string; vanguard: string; price: number; color: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sirenRef = useRef<HTMLAudioElement | null>(null);
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const soldRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload air horn sound (Bolder source)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2857/2857-preview.mp3');
    audio.volume = 1.0;
    sirenRef.current = audio;

    // Preload clock tick sound
    const tick = new Audio('https://assets.mixkit.co/active_storage/sfx/2590/2590-preview.mp3');
    tick.volume = 0.4;
    tickRef.current = tick;

    // Preload sold sound (Celebration/Cheer)
    const sold = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    sold.volume = 0.8;
    soldRef.current = sold;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          // Play tick sound for final 5 seconds
          if (next <= 5 && next > 0 && tickRef.current) {
            tickRef.current.currentTime = 0;
            tickRef.current.play().catch(e => console.log('Tick failed:', e));
          }
          return next;
        });
      }, 1000);
    } else {
      if (timeLeft === 0) {
        setIsTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // Play horn sound twice (Speedy & Bold)
        const playHornTwice = async () => {
          if (sirenRef.current) {
            try {
              // First horn
              await sirenRef.current.play();
              // Speedy gap (300ms) then play again
              setTimeout(() => {
                if (sirenRef.current) {
                  sirenRef.current.currentTime = 0;
                  sirenRef.current.play().catch(e => console.log('Second horn failed:', e));
                }
              }, 300);
            } catch (err) {
              console.log('Audio play failed:', err);
            }
          }
        };

        playHornTwice();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timeLeft]);

  const handleStartTimer = () => setIsTimerActive(true);
  const handleResetTimer = () => {
    setTimeLeft(TIMER_DURATION);
    setIsTimerActive(true);
  };

  const selectedTeam = vanguards.find((v) => v.id === selectedVanguard);
  const canAfford = selectedTeam ? (selectedTeam.budget - selectedTeam.spent) >= bidAmount : true;

  const handleConfirmSale = () => {
    if (!currentStudent || !selectedVanguard) {
      setError('Please select a Vanguard');
      return;
    }

    if (!canAfford) {
      setError(`${selectedTeam?.name} cannot afford this bid`);
      return;
    }

    setError('');

    const details = {
      name: currentStudent.name,
      vanguard: selectedTeam?.name || '',
      price: bidAmount,
      color: selectedTeam?.color || 'primary'
    };

    setSoldDetails(details);
    setShowSoldOverlay(true);

    // Play Sold sound
    if (soldRef.current) {
      soldRef.current.currentTime = 0;
      soldRef.current.play().catch(e => console.log('Sold sound failed:', e));
    }

    // High energy confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    onSale(currentStudent.id, selectedVanguard, bidAmount);
    setBidAmount(BASE_PRICE);
    setSelectedVanguard('');

    // Reset timer to full but keep it paused during overlay
    setIsTimerActive(false);
    setTimeLeft(TIMER_DURATION);

    setTimeout(() => {
      setShowSoldOverlay(false);
      setSoldDetails(null);
      // Auto-start for the next student
      setIsTimerActive(true);
    }, 3500);
  };

  const getVanguardColor = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-vanguard-emerald',
      blue: 'bg-vanguard-blue',
      amber: 'bg-vanguard-amber',
      rose: 'bg-vanguard-rose',
    };
    return colors[color] || 'bg-primary';
  };

  if (!currentStudent) {
    return (
      <div className="glass-card-elevated rounded-2xl p-8 text-center animate-scale-in">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Gavel className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gradient">Auction Complete</h2>
          <p className="text-muted-foreground text-lg">
            All students have been auctioned successfully
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-elevated rounded-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Live Auction
            </span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            <span className="text-primary font-bold">{totalCount - remainingCount + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Student Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {currentStudent.name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  <span className="font-mono text-sm">{currentStudent.grNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="glass-card rounded-lg px-4 py-3 flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Base Price</p>
                <p className="text-xl font-bold text-primary number-display">{BASE_PRICE} cr</p>
              </div>
              <div className={`glass-card rounded-lg px-4 py-3 flex-1 border-2 transition-colors ${timeLeft <= 5 ? 'border-destructive/50 bg-destructive/10' : 'border-transparent'}`}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Timer</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xl font-bold number-display ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                    {timeLeft}s
                  </p>
                  <div className="flex gap-1">
                    {!isTimerActive ? (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleStartTimer}>
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsTimerActive(false)}>
                        <div className="w-2 h-2 bg-foreground rounded-sm" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleResetTimer}>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Controls */}
          <div className="space-y-6">
            {/* Vanguard Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Select Vanguard
              </label>
              <Select value={selectedVanguard} onValueChange={setSelectedVanguard}>
                <SelectTrigger className="h-14 bg-secondary border-border text-lg">
                  <SelectValue placeholder="Choose winning team..." />
                </SelectTrigger>
                <SelectContent>
                  {vanguards.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getVanguardColor(v.color)}`} />
                        <span>{v.name}</span>
                        <span className="text-muted-foreground">
                          ({(v.budget - v.spent).toFixed(2)} cr left)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bid Amount */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Final Price
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Math.max(0, Number(e.target.value)))}
                    className="w-24 h-10 text-center text-lg font-bold bg-secondary border-border number-display"
                    min={0}
                    step={0.05}
                  />
                  <span className="text-muted-foreground font-medium">cr</span>
                </div>
              </div>
              <Slider
                value={[bidAmount]}
                onValueChange={([value]) => setBidAmount(value)}
                min={0}
                max={100}
                step={0.05}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{BASE_PRICE} cr (Base)</span>
                <span>Max: 100 cr</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleConfirmSale}
                disabled={!selectedVanguard || !canAfford}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary disabled:opacity-50 disabled:glow-none"
              >
                <Gavel className="w-5 h-5 mr-2" />
                Confirm Sale
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* SOLD OVERLAY */}
      {showSoldOverlay && soldDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative z-10 text-center space-y-8 animate-scale-in">
            <div className={`inline-block px-12 py-4 rounded-2xl bg-vanguard-${soldDetails.color} shadow-[0_0_50px_rgba(0,0,0,0.5)] glow-${soldDetails.color}`}>
              <h2 className="text-8xl font-black text-white italic tracking-tighter animate-bounce">
                SOLD!
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white uppercase tracking-[0.3em] opacity-80">
                {soldDetails.name}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-white/20" />
                <p className={`text-5xl font-black text-vanguard-${soldDetails.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
                  {soldDetails.vanguard}
                </p>
                <span className="h-px w-12 bg-white/20" />
              </div>
              <p className="text-4xl font-black text-white/90 font-mono mt-4">
                {soldDetails.price.toFixed(2)} <span className="text-xl">cr</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

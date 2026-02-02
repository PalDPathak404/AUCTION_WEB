import { useState } from 'react';
import { Gavel, User, Hash, ChevronRight, AlertCircle } from 'lucide-react';
import { Student, Vanguard } from '@/types/auction';
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
  onSkip: () => void;
  remainingCount: number;
  totalCount: number;
}

const BASE_PRICE = 20;

export function AuctionStage({
  currentStudent,
  vanguards,
  onSale,
  onSkip,
  remainingCount,
  totalCount,
}: AuctionStageProps) {
  const [bidAmount, setBidAmount] = useState(BASE_PRICE);
  const [selectedVanguard, setSelectedVanguard] = useState<string>('');
  const [error, setError] = useState<string>('');

  const selectedTeam = vanguards.find((v) => v.id === selectedVanguard);
  const canAfford = selectedTeam ? selectedTeam.budget - selectedTeam.spent >= bidAmount : true;

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
    onSale(currentStudent.id, selectedVanguard, bidAmount);
    setBidAmount(BASE_PRICE);
    setSelectedVanguard('');
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
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Block</p>
                <p className="text-xl font-bold number-display">{currentStudent.block}</p>
              </div>
              <div className="glass-card rounded-lg px-4 py-3 flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Base Price</p>
                <p className="text-xl font-bold text-primary number-display">{BASE_PRICE} L</p>
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
                          ({(v.budget - v.spent).toFixed(1)} cr left)
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
                    onChange={(e) => setBidAmount(Math.max(BASE_PRICE, Number(e.target.value)))}
                    className="w-24 h-10 text-center text-lg font-bold bg-secondary border-border number-display"
                    min={BASE_PRICE}
                    step={0.5}
                  />
                  <span className="text-muted-foreground font-medium">Lakhs</span>
                </div>
              </div>
              <Slider
                value={[bidAmount]}
                onValueChange={([value]) => setBidAmount(value)}
                min={BASE_PRICE}
                max={100}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{BASE_PRICE} L (Base)</span>
                <span>100 L (Max)</span>
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
                variant="outline"
                onClick={onSkip}
                className="flex-1 h-12 border-border hover:bg-secondary"
              >
                Skip
              </Button>
              <Button
                onClick={handleConfirmSale}
                disabled={!selectedVanguard || !canAfford}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary disabled:opacity-50 disabled:glow-none"
              >
                <Gavel className="w-5 h-5 mr-2" />
                Confirm Sale
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

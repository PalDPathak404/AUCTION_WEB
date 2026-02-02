import { Users, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Vanguard } from '@/types/auction';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VanguardCardProps {
  vanguard: Vanguard;
}

export function VanguardCard({ vanguard }: VanguardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const remaining = vanguard.budget - vanguard.spent;
  const spentPercentage = (vanguard.spent / vanguard.budget) * 100;

  const colorClasses: Record<string, { bg: string; border: string; glow: string; text: string }> = {
    emerald: {
      bg: 'bg-vanguard-emerald',
      border: 'border-vanguard-emerald/30',
      glow: 'glow-emerald',
      text: 'text-vanguard-emerald',
    },
    blue: {
      bg: 'bg-vanguard-blue',
      border: 'border-vanguard-blue/30',
      glow: 'glow-blue',
      text: 'text-vanguard-blue',
    },
    amber: {
      bg: 'bg-vanguard-amber',
      border: 'border-vanguard-amber/30',
      glow: 'glow-amber',
      text: 'text-vanguard-amber',
    },
    rose: {
      bg: 'bg-vanguard-rose',
      border: 'border-vanguard-rose/30',
      glow: 'glow-rose',
      text: 'text-vanguard-rose',
    },
  };

  const colors = colorClasses[vanguard.color] || colorClasses.emerald;

  return (
    <div
      className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? colors.glow : ''
      } ${colors.border}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${colors.bg}`} />
            <h3 className="font-semibold text-foreground">{vanguard.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="font-bold number-display">{vanguard.squad.length}</span>
          </div>
        </div>

        {/* Budget Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget</span>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold number-display ${colors.text}`}>
                {remaining.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">cr</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.bg} transition-all duration-500 ease-out`}
              style={{ width: `${100 - spentPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Spent: {vanguard.spent.toFixed(1)} cr</span>
            <span>Total: {vanguard.budget} cr</span>
          </div>
        </div>
      </div>

      {/* Squad Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm text-muted-foreground">
          Squad ({vanguard.squad.length} players)
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Squad List */}
      {isExpanded && (
        <ScrollArea className="max-h-48 border-t border-border/50">
          <div className="p-3 space-y-1">
            {vanguard.squad.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No players acquired yet
              </p>
            ) : (
              vanguard.squad.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {student.grNumber}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${colors.text} number-display`}>
                    {student.soldPrice} L
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

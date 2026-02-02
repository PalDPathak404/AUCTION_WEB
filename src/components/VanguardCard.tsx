import { Users, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Vanguard } from '@/types/auction';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface VanguardCardProps {
  vanguard: Vanguard;
}

export function VanguardCard({ vanguard }: VanguardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const remaining = vanguard.budget - vanguard.spent;
  const spentPercentage = (vanguard.spent / vanguard.budget) * 100;

  const colorClasses: Record<string, { bg: string; border: string; glow: string; text: string; shadow: string }> = {
    emerald: {
      bg: 'bg-vanguard-emerald',
      border: 'border-vanguard-emerald/30',
      glow: 'glow-emerald',
      text: 'text-vanguard-emerald',
      shadow: 'hover:shadow-vanguard-emerald/20',
    },
    blue: {
      bg: 'bg-vanguard-blue',
      border: 'border-vanguard-blue/30',
      glow: 'glow-blue',
      text: 'text-vanguard-blue',
      shadow: 'hover:shadow-vanguard-blue/20',
    },
    amber: {
      bg: 'bg-vanguard-amber',
      border: 'border-vanguard-amber/30',
      glow: 'glow-amber',
      text: 'text-vanguard-amber',
      shadow: 'hover:shadow-vanguard-amber/20',
    },
    rose: {
      bg: 'bg-vanguard-rose',
      border: 'border-vanguard-rose/30',
      glow: 'glow-rose',
      text: 'text-vanguard-rose',
      shadow: 'hover:shadow-vanguard-rose/20',
    },
  };

  const colors = colorClasses[vanguard.color] || colorClasses.emerald;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={(open) => setIsExpanded(open)}
      className={`group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 ease-in-out border-2 ${isExpanded ? `${colors.border} ${colors.glow} scale-[1.02]` : 'border-transparent hover:border-border/50'
        } ${colors.shadow} hover:shadow-2xl`}
    >
      <CollapsibleTrigger asChild>
        <div className="cursor-pointer">
          {/* Header Section */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 duration-300`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{vanguard.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Vanguard</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-bold number-display">{vanguard.squad.length}</span>
              </div>
            </div>

            {/* Budget Visualization */}
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Available Budget</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black number-display leading-none ${colors.text}`}>
                      {remaining.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground uppercase">cr</span>
                  </div>
                </div>
                <div className="pb-1">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground animate-bounce" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative h-2.5 bg-secondary/30 rounded-full overflow-hidden border border-border/10">
                <div
                  className={`absolute left-0 top-0 h-full ${colors.bg} transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                  style={{ width: `${100 - spentPercentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>Spent: {vanguard.spent.toFixed(2)} cr</span>
                <span>Limit: {vanguard.budget} cr</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="animate-accordion-down overflow-hidden">
        <div className="border-t border-border/50 bg-secondary/10">
          <div className="px-5 py-3 flex items-center justify-between bg-secondary/20">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Squad Roster</h4>
            <span className="text-[10px] font-mono text-muted-foreground">{vanguard.squad.length} Active Slots</span>
          </div>
          <ScrollArea className="h-[260px]">
            <div className="p-4 space-y-2">
              {vanguard.squad.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-50">
                  <Users className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Awaitng Draft Picks
                  </p>
                </div>
              ) : (
                vanguard.squad.map((student, index) => (
                  <div
                    key={student.id}
                    className="group/item flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black font-mono text-muted-foreground opacity-30 group-hover/item:opacity-70 transition-opacity">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                          {student.name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground tracking-tighter">
                          {student.grNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black number-display ${colors.text}`}>
                        {student.soldPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground ml-1">cr</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}


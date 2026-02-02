import { Trophy, Zap } from 'lucide-react';

interface HeaderProps {
  auctionActive: boolean;
}

export function Header({ auctionActive }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center glow-primary">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Vanguard Elite Auction
              </h1>
              <p className="text-sm text-muted-foreground">Professional Draft Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {auctionActive && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Live Auction</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

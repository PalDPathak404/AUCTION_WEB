import { Header } from '@/components/Header';
import { AuctionStage } from '@/components/AuctionStage';
import { VanguardCard } from '@/components/VanguardCard';
import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    vanguards,
    currentStudent,
    availableStudents,
    handleSale,
    resetAuction,
  } = useAuction();

  return (
    <div className="min-h-screen bg-background">
      <Header auctionActive={availableStudents.length > 0} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Main Auction Stage - Maximized */}
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <AuctionStage
            currentStudent={currentStudent}
            vanguards={vanguards}
            onSale={handleSale}
            remainingCount={availableStudents.length}
            totalCount={availableStudents.length + vanguards.reduce((acc, v) => acc + v.squad.length, 0)}
          />

          {/* Stats Summary - Compact Row */}
          <div className="glass-card rounded-xl p-6 border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">Sold</p>
                <div className="text-3xl font-black text-primary number-display">
                  {vanguards.reduce((acc, v) => acc + v.squad.length, 0)}
                </div>
              </div>
              <div className="text-center group">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 group-hover:text-foreground transition-colors">Active</p>
                <div className="text-3xl font-black text-foreground number-display">
                  {availableStudents.length}
                </div>
              </div>
              <div className="text-center group">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 group-hover:text-vanguard-amber transition-colors">Spent</p>
                <div className="text-3xl font-black text-vanguard-amber number-display">
                  {vanguards.reduce((sum, v) => sum + v.spent, 0).toFixed(1)}
                  <span className="text-xs font-bold ml-1">cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vanguard Grid - 4 Columns */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tighter italic">VANGUARD LEADERBOARD</h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Real-time team standings & remaining budgets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vanguards.map((vanguard) => (
              <VanguardCard key={vanguard.id} vanguard={vanguard} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

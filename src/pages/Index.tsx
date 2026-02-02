import { Header } from '@/components/Header';
import { AuctionStage } from '@/components/AuctionStage';
import { VanguardCard } from '@/components/VanguardCard';
import { StudentRoster } from '@/components/StudentRoster';
import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    students,
    vanguards,
    currentStudent,
    availableStudents,
    handleSale,
    handleSkip,
    resetAuction,
  } = useAuction();

  return (
    <div className="min-h-screen bg-background">
      <Header auctionActive={availableStudents.length > 0} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Auction Stage */}
          <div className="lg:col-span-8 space-y-6">
            <AuctionStage
              currentStudent={currentStudent}
              vanguards={vanguards}
              onSale={handleSale}
              onSkip={handleSkip}
              remainingCount={availableStudents.length}
              totalCount={students.length}
            />

            {/* Student Roster */}
            <div className="h-[400px]">
              <StudentRoster students={students} />
            </div>
          </div>

          {/* Sidebar - Vanguard Leaderboard */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Vanguard Leaderboard</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAuction}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              {vanguards.map((vanguard) => (
                <VanguardCard key={vanguard.id} vanguard={vanguard} />
              ))}
            </div>

            {/* Stats Summary */}
            <div className="glass-card rounded-xl p-4 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Auction Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary number-display">
                    {students.length - availableStudents.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Players Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground number-display">
                    {availableStudents.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-vanguard-amber number-display">
                    {vanguards.reduce((sum, v) => sum + v.spent, 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total Spent (cr)</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-vanguard-blue number-display">
                    {vanguards.reduce((sum, v) => sum + v.squad.length, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total Drafted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

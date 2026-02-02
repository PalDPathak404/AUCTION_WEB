import { useState } from 'react';
import { useAuction } from '@/hooks/useAuction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Menu, Search, Edit2, RotateCcw, Save, X, ArrowLeft, Gavel, FastForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'admin@2026';

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVanguard, setEditVanguard] = useState<string>('');
    const [editPrice, setEditPrice] = useState<number>(0);

    const { students, vanguards, currentStudent, handleSkip, undoSale, updateSale, resetAuction } = useAuction();

    const handleResetSystem = () => {
        const userInput = window.prompt("CRITICAL ACTION: This will RESET the entire auction system. All sales and budgets will be cleared. This cannot be undone.\n\nType 'SURE' to confirm:");

        if (userInput === 'SURE') {
            resetAuction();
            toast.success("System has been fully reset");
        } else if (userInput !== null) {
            toast.error("Reset cancelled. Confirmation text did not match.");
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            toast.success('Admin authenticated successfully');
        } else {
            toast.error('Incorrect password');
        }
    };

    const startEditing = (student: any) => {
        setEditingId(student.id);
        setEditVanguard(student.soldTo || '');
        setEditPrice(student.soldPrice || 0);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditVanguard('');
        setEditPrice(0);
    };

    const handleSave = (studentId: string) => {
        updateSale(studentId, editVanguard, editPrice);
        setEditingId(null);
        toast.success('Sale updated successfully');
    };

    const handleUndo = (studentId: string) => {
        if (confirm('Are you sure you want to undo this sale?')) {
            undoSale(studentId);
            toast.info('Sale undone');
        }
    };

    const filteredSoldStudents = students.filter(s =>
        s.status === 'sold' &&
        (s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.grNumber.toLowerCase().includes(search.toLowerCase()))
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="glass-card-elevated p-8 rounded-2xl w-full max-w-md space-y-6 animate-scale-in">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gradient">Admin Access</h1>
                        <p className="text-muted-foreground">Enter password to manage auction</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-secondary text-lg h-12"
                        />
                        <Button type="submit" className="w-full h-12 text-lg font-semibold glow-primary">
                            Authenticate
                        </Button>
                        <Link to="/auction" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" /> Back to Auction
                        </Link>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] border-r-border/50">
                                <SheetHeader className="mb-8">
                                    <SheetTitle className="text-2xl font-bold">Admin Portal</SheetTitle>
                                </SheetHeader>
                                <nav className="space-y-2">
                                    <Button variant="secondary" className="w-full justify-start gap-2 h-12 text-lg">
                                        <Edit2 className="w-5 h-5 text-primary" />
                                        Correct Sales
                                    </Button>
                                    <Link to="/auction">
                                        <Button variant="ghost" className="w-full justify-start gap-2 h-12 text-lg text-muted-foreground hover:text-foreground">
                                            <ArrowLeft className="w-5 h-5" />
                                            Exit Admin
                                        </Button>
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetSystem}
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset System
                        </Button>
                        <Link to="/auction">
                            <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                                Exit Admin
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-12 animate-slide-up">
                {/* Current Student Control - NEW SECTION */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Queue Management</h2>
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-primary flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Gavel className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                {currentStudent ? (
                                    <>
                                        <h3 className="text-2xl font-black text-foreground">{currentStudent.name}</h3>
                                        <p className="text-muted-foreground font-mono">GR: {currentStudent.grNumber} • Currently Active in Auction</p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground italic font-medium">No student currently active in auction</p>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleSkip}
                            disabled={!currentStudent}
                            variant="secondary"
                            className="h-14 px-8 text-lg font-bold gap-3 bg-secondary hover:bg-primary hover:text-white transition-all duration-300 rounded-xl"
                        >
                            <FastForward className="w-6 h-6" />
                            Skip to End
                        </Button>
                    </div>
                </div>

                {/* Management Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Sale Corrections</h2>
                            <p className="text-muted-foreground">Modify team assignments or prices for sold students</p>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sold students..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-secondary border-border"
                            />
                        </div>
                    </div>

                    <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
                        <Table>
                            <TableHeader className="bg-secondary/50">
                                <TableRow>
                                    <TableHead className="w-[120px]">GR Number</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Current Team</TableHead>
                                    <TableHead>Price (cr)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSoldStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No sold students found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSoldStudents.map((student) => {
                                        const isEditing = editingId === student.id;
                                        const vanguard = vanguards.find(v => v.id === student.soldTo);

                                        return (
                                            <TableRow key={student.id} className="hover:bg-secondary/30 transition-colors">
                                                <TableCell className="font-mono text-sm">{student.grNumber}</TableCell>
                                                <TableCell className="font-medium">{student.name}</TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <Select value={editVanguard} onValueChange={setEditVanguard}>
                                                            <SelectTrigger className="w-[180px] h-9 bg-background border-border">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {vanguards.map(v => (
                                                                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full bg-vanguard-${vanguard?.color}`} />
                                                            {vanguard?.name}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                step="0.05"
                                                                value={editPrice}
                                                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                                                className="w-24 h-9 bg-background border-border"
                                                            />
                                                            <span className="text-xs text-muted-foreground uppercase">cr</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold number-display">{student.soldPrice} cr</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <Button size="sm" onClick={() => handleSave(student.id)} className="bg-primary hover:bg-primary/90 glow-primary h-9">
                                                                    <Save className="w-4 h-4 mr-2" /> Save
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-9">
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button size="sm" variant="outline" onClick={() => startEditing(student)} className="border-border hover:bg-secondary h-9">
                                                                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                                                                </Button>
                                                                <Button size="sm" variant="outline" onClick={() => handleUndo(student.id)} className="border-border hover:bg-destructive/10 hover:text-destructive h-9">
                                                                    <RotateCcw className="w-4 h-4 mr-1" /> Undo
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Admin;

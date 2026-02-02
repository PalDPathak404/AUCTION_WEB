import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Student, Vanguard, AuctionState as AuctionStateType } from '@/types/auction';
import { allStudents, initialVanguards, getShuffledStudents } from '@/data/students';

interface AuctionContextType {
    students: Student[];
    vanguards: Vanguard[];
    currentStudent: Student | null;
    availableStudents: Student[];
    auctionState: AuctionStateType;
    handleSale: (studentId: string, vanguardId: string, price: number) => void;
    handleSkip: () => void;
    undoSale: (studentId: string) => void;
    updateSale: (studentId: string, newVanguardId: string, newPrice: number) => void;
    resetAuction: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>(allStudents);
    const [vanguards, setVanguards] = useState<Vanguard[]>(initialVanguards);
    const [auctionState, setAuctionState] = useState<AuctionStateType>({
        currentStudentIndex: 0,
        isActive: true,
        bidAmount: 0.2,
        selectedVanguard: null,
    });

    const availableStudents = useMemo(
        () => students.filter((s) => s.status === 'available'),
        [students]
    );

    const currentStudent = useMemo(() => {
        return availableStudents[0] || null;
    }, [availableStudents]);

    const handleSale = useCallback(
        (studentId: string, vanguardId: string, price: number) => {
            setStudents((prev) =>
                prev.map((s) =>
                    s.id === studentId
                        ? { ...s, status: 'sold' as const, soldTo: vanguardId, soldPrice: price }
                        : s
                )
            );

            setVanguards((prev) =>
                prev.map((v) => {
                    if (v.id === vanguardId) {
                        const studentToBuy = students.find((s) => s.id === studentId);
                        if (!studentToBuy) return v;

                        return {
                            ...v,
                            spent: v.spent + price,
                            squad: [
                                ...v.squad,
                                { ...studentToBuy, status: 'sold' as const, soldTo: vanguardId, soldPrice: price }
                            ],
                        };
                    }
                    return v;
                })
            );
        },
        [students]
    );

    const handleSkip = useCallback(() => {
        if (currentStudent) {
            setStudents((prev) => {
                const withoutCurrent = prev.filter((s) => s.id !== currentStudent.id);
                return [...withoutCurrent, currentStudent];
            });
        }
    }, [currentStudent]);

    const undoSale = useCallback((studentId: string) => {
        setStudents((prev) => {
            const student = prev.find(s => s.id === studentId);
            if (!student || student.status !== 'sold') return prev;

            const oldVanguardId = student.soldTo;
            const oldPrice = student.soldPrice || 0;

            setVanguards((vPrev) => vPrev.map(v => {
                if (v.id === oldVanguardId) {
                    return {
                        ...v,
                        spent: v.spent - oldPrice,
                        squad: v.squad.filter(s => s.id !== studentId)
                    };
                }
                return v;
            }));

            return prev.map(s => s.id === studentId ? { ...s, status: 'available', soldTo: undefined, soldPrice: undefined } : s);
        });
    }, []);

    const updateSale = useCallback((studentId: string, newVanguardId: string, newPrice: number) => {
        setStudents((prev) => {
            const student = prev.find(s => s.id === studentId);
            if (!student || student.status !== 'sold') return prev;

            const oldVanguardId = student.soldTo;
            const oldPrice = student.soldPrice || 0;

            setVanguards((vPrev) => vPrev.map(v => {
                if (v.id === oldVanguardId) {
                    v = {
                        ...v,
                        spent: v.spent - oldPrice,
                        squad: v.squad.filter(s => s.id !== studentId)
                    };
                }
                if (v.id === newVanguardId) {
                    const updatedStudent = { ...student, status: 'sold' as const, soldTo: newVanguardId, soldPrice: newPrice };
                    v = {
                        ...v,
                        spent: v.spent + newPrice,
                        squad: [...v.squad, updatedStudent]
                    };
                }
                return v;
            }));

            return prev.map(s => s.id === studentId ? { ...s, soldTo: newVanguardId, soldPrice: newPrice } : s);
        });
    }, []);

    const resetAuction = useCallback(() => {
        setStudents(getShuffledStudents());
        setVanguards(initialVanguards);
        setAuctionState({
            currentStudentIndex: 0,
            isActive: true,
            bidAmount: 0.2,
            selectedVanguard: null,
        });
    }, []);

    const value = {
        students,
        vanguards,
        currentStudent,
        availableStudents,
        auctionState,
        handleSale,
        handleSkip,
        undoSale,
        updateSale,
        resetAuction,
    };

    return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
};

export const useAuctionContext = () => {
    const context = useContext(AuctionContext);
    if (context === undefined) {
        throw new Error('useAuctionContext must be used within an AuctionProvider');
    }
    return context;
};

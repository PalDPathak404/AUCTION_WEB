import { useState, useCallback, useMemo } from 'react';
import { Student, Vanguard, AuctionState } from '@/types/auction';
import { allStudents, initialVanguards } from '@/data/students';

export function useAuction() {
  const [students, setStudents] = useState<Student[]>(allStudents);
  const [vanguards, setVanguards] = useState<Vanguard[]>(initialVanguards);
  const [auctionState, setAuctionState] = useState<AuctionState>({
    currentStudentIndex: 0,
    isActive: true,
    bidAmount: 20,
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
      // Convert lakhs to crore (100 lakhs = 1 crore)
      const priceInCrore = price / 100;

      // Update student status
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, status: 'sold' as const, soldTo: vanguardId, soldPrice: price }
            : s
        )
      );

      // Update vanguard budget and squad
      setVanguards((prev) =>
        prev.map((v) => {
          if (v.id === vanguardId) {
            const soldStudent = students.find((s) => s.id === studentId);
            return {
              ...v,
              spent: v.spent + priceInCrore,
              squad: soldStudent
                ? [...v.squad, { ...soldStudent, status: 'sold' as const, soldTo: vanguardId, soldPrice: price }]
                : v.squad,
            };
          }
          return v;
        })
      );
    },
    [students]
  );

  const handleSkip = useCallback(() => {
    // Move current student to end of available list
    if (currentStudent) {
      setStudents((prev) => {
        const withoutCurrent = prev.filter((s) => s.id !== currentStudent.id);
        return [...withoutCurrent, currentStudent];
      });
    }
  }, [currentStudent]);

  const resetAuction = useCallback(() => {
    setStudents(allStudents);
    setVanguards(initialVanguards);
    setAuctionState({
      currentStudentIndex: 0,
      isActive: true,
      bidAmount: 20,
      selectedVanguard: null,
    });
  }, []);

  return {
    students,
    vanguards,
    currentStudent,
    availableStudents,
    auctionState,
    handleSale,
    handleSkip,
    resetAuction,
  };
}

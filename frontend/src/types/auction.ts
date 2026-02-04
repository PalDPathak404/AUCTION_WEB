/**
 * STRICT SOURCE DATA (From JSON/Sheets)
 */
export interface StudentIdentity {
  id: string;
  name: string;
  grNumber: string;
  image_url: string;
}

/**
 * RUNTIME STATE (In Store)
 * Extends proper identity with auction state.
 */
export interface Student extends StudentIdentity {
  status: 'available' | 'sold' | 'unsold';
  soldTo?: string;
  soldPrice?: number;
}

export interface Vanguard {
  id: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
  squad: Student[];
  leader?: string;
}

export interface AuctionState {
  currentStudentIndex: number;
  isActive: boolean;
  bidAmount: number;
  selectedVanguard: string | null;
}

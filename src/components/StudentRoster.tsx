import { useState } from 'react';
import { Search, Filter, Check, Clock } from 'lucide-react';
import { Student } from '@/types/auction';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StudentRosterProps {
  students: Student[];
}

export function StudentRoster({ students }: StudentRosterProps) {
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.grNumber.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = blockFilter === 'all' || student.block.toString() === blockFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesBlock && matchesStatus;
  });

  const availableCount = students.filter((s) => s.status === 'available').length;
  const soldCount = students.filter((s) => s.status === 'sold').length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Full Roster</h3>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{availableCount} Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">{soldCount} Sold</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or GR number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={blockFilter} onValueChange={setBlockFilter}>
            <SelectTrigger className="w-[120px] bg-secondary border-border">
              <SelectValue placeholder="Block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              <SelectItem value="3">Block 3</SelectItem>
              <SelectItem value="4">Block 4</SelectItem>
              <SelectItem value="5">Block 5</SelectItem>
              <SelectItem value="6">Block 6</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-card border-b border-border/50">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">GR Number</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium text-center">Block</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={`hover:bg-secondary/50 transition-colors ${
                  student.status === 'sold' ? 'opacity-60' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {student.grNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{student.name}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-sm font-medium">
                    {student.block}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {student.status === 'sold' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      <Check className="w-3 h-3" />
                      Sold
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-xs font-medium text-primary">
                      <Clock className="w-3 h-3" />
                      Available
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {student.status === 'sold' && student.soldPrice ? (
                    <span className="font-bold number-display text-foreground">
                      {student.soldPrice} L
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="w-8 h-8 mb-3 opacity-50" />
            <p>No students found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

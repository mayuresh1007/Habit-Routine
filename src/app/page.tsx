'use client';

import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Header } from '@/components/dashboard/header';
import { TodaySummary } from '@/components/dashboard/today-summary';
import { StreakDisplay } from '@/components/dashboard/streak-display';
import { HabitList } from '@/components/habits/habit-list';
import { HabitGrid } from '@/components/habits/habit-grid';
import { RoutineBlock } from '@/components/routines/routine-block';
import { PrintView } from '@/components/export/print-view';
import { useHabitStore } from '@/store/habit-store';
import { useRoutineStore } from '@/store/routine-store';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();

  const fetchHabits = useHabitStore((s) => s.fetchHabits);
  const fetchRoutines = useRoutineStore((s) => s.fetchRoutines);

  const isHabitsLoading = useHabitStore((s) => s.isLoading);
  const isRoutinesLoading = useRoutineStore((s) => s.isLoading);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHabits();
      fetchRoutines();
    }
  }, [status, fetchHabits, fetchRoutines]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Habit Tracker & Routine Planner',
  });

  if (status === 'loading' || isHabitsLoading || isRoutinesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Next.js middleware handles unauthenticated redirects so we safely render dashboard here
  return (
    <>
      <div 
         className="min-h-screen print:hidden bg-gradient-to-r bg-fixed"
         style={{ backgroundImage: 'var(--bg-gradient)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <Header onExport={handlePrint} />

          {/* Summary row */}
          <div className="flex flex-col sm:flex-row sm:grid sm:grid-cols-2 gap-4 mb-6">
            <TodaySummary />
            <StreakDisplay />
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <HabitList />
            </div>
            <div className="space-y-6">
              <RoutineBlock />
            </div>
          </div>

          {/* Monthly grid */}
          <HabitGrid />
        </div>
      </div>

      {/* Hidden print view */}
      <PrintView ref={printRef} />
    </>
  );
}

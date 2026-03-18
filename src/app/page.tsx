'use client';

import { useRef, useEffect, useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchHabits = useHabitStore((s) => s.fetchHabits);
  const fetchRoutines = useRoutineStore((s) => s.fetchRoutines);

  const isHabitsLoading = useHabitStore((s) => s.isLoading);
  const isRoutinesLoading = useRoutineStore((s) => s.isLoading);
  const habits = useHabitStore((s) => s.habits);
  const routineItems = useRoutineStore((s) => s.items);

  const hasData = habits.length > 0 || routineItems.length > 0;

  useEffect(() => {
    if (status === 'authenticated') {
      Promise.all([fetchHabits(), fetchRoutines()]).finally(() => {
        setIsInitialLoad(false);
      });
    } else if (status === 'unauthenticated') {
      setIsInitialLoad(false);
    }
  }, [status, fetchHabits, fetchRoutines]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Habit Tracker & Routine Planner',
  });

  if (status === 'loading' || isInitialLoad) {
    return (
      <div
        className="min-h-screen print:hidden bg-gradient-to-r bg-fixed"
        style={{ backgroundImage: 'var(--bg-gradient)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          {/* Header Skeleton */}
          <header className="flex items-center justify-between py-4 border-b border-border/40 mb-6 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-48 rounded-lg outline-none" />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-10 w-10 text-transparent rounded-full" />
              <Skeleton className="h-10 w-10 text-transparent rounded-full" />
              <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block"></div>
              <Skeleton className="h-10 w-10 text-transparent rounded-full" />
            </div>
          </header>

          {/* Summary row Skeleton */}
          <div className="flex flex-col sm:flex-row sm:grid sm:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Main content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>

          {/* Monthly grid Skeleton */}
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
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
          <Header onExport={handlePrint} showExport={hasData} />

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

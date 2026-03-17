'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Header } from '@/components/dashboard/header';
import { TodaySummary } from '@/components/dashboard/today-summary';
import { StreakDisplay } from '@/components/dashboard/streak-display';
import { HabitList } from '@/components/habits/habit-list';
import { HabitGrid } from '@/components/habits/habit-grid';
import { RoutineBlock } from '@/components/routines/routine-block';
import { PrintView } from '@/components/export/print-view';

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Habit Tracker & Routine Planner',
  });

  return (
    <>
      <div className="min-h-screen bg-background print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <Header onExport={handlePrint} />

          {/* Summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

'use client';

import { ChevronLeft, ChevronRight, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanySwitcher } from '@/components/prime/company-switcher';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export function Sidebar({
  hidden,
  onHide,
  onShow,
  onPointerEnter,
  onPointerLeave,
}) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-30 flex w-(--sidebar-width) shrink-0 flex-col items-stretch border-e border-border/60 bg-muted/95 shadow-[8px_0_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-transform duration-500 ease-out',
        hidden
          ? '-translate-x-[calc(100%-var(--sidebar-rail-width))]'
          : 'translate-x-0',
      )}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div
        className={cn(
          'flex min-h-0 grow flex-col transition-[opacity,visibility] duration-200',
          hidden ? 'invisible opacity-0' : 'visible opacity-100',
        )}
        aria-hidden={hidden}
      >
        <SidebarHeader />
        <div className="mx-3 flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/50 py-3 shadow-sm">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Company
          </span>
          <CompanySwitcher compact />
        </div>
        <div className="min-h-0 grow">
          <SidebarMenu />
        </div>

        <div className="shrink-0 border-t border-border/50 p-3">
          <button
            type="button"
            onClick={onHide}
            className="group mx-auto flex h-10 w-16 items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-background/70 text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Minimize sidebar"
            title="Minimize sidebar"
          >
            <ChevronLeft
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2.25}
            />
            <span className="text-[10px] font-semibold">Hide</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 end-0 flex w-(--sidebar-rail-width) flex-col items-center border-s border-border/60 bg-muted/95 opacity-0 transition-opacity duration-300',
          hidden && 'pointer-events-auto opacity-100',
        )}
      >
        <div className="mt-6 flex size-8 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-muted-foreground shadow-sm">
          <PanelLeft className="size-4" strokeWidth={1.8} />
        </div>

        <button
          type="button"
          onClick={onShow}
          className="group absolute top-1/2 flex h-14 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground shadow-md transition-all duration-200 hover:border-primary/35 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Tampilkan sidebar"
          title="Tampilkan sidebar"
        >
          <ChevronRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.25}
          />
        </button>

        <span className="mb-6 mt-auto text-[8px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60 [writing-mode:vertical-rl]">
          Menu
        </span>
      </div>
    </aside>
  );
}

'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAutoHideSidebar } from '@/hooks/use-auto-hide-sidebar';
import { useBodyClass } from '@/hooks/use-body-class';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

export function Demo8Layout({ children }) {
  const isMobile = useIsMobile();
  const { setOption } = useSettings();
  const sidebar = useAutoHideSidebar({ disabled: true });

  // Using the custom hook to set classes on the body
  useBodyClass(`
    [--header-height:60px]
    [--sidebar-width:90px]
    [--sidebar-rail-width:44px]
    bg-muted!
  `);

  useEffect(() => {
    setOption('layout', 'demo8');
  }, [setOption]);

  return (
    <div className="flex h-dvh min-h-0 w-full min-w-0 grow overflow-hidden">
      {isMobile && <Header />}

      <div className="flex min-h-0 w-full min-w-0 grow flex-col pt-(--header-height) lg:flex-row lg:pt-0">
        {!isMobile && (
          <Sidebar
            hidden={sidebar.hidden}
            onHide={sidebar.hide}
            onShow={sidebar.show}
            onPointerEnter={sidebar.pause}
            onPointerLeave={sidebar.schedule}
          />
        )}

        <div
          className={cn(
            'm-3 mt-0 flex min-h-0 min-w-0 grow flex-col overflow-hidden rounded-xl border border-input bg-background transition-[margin] duration-500 ease-out lg:m-3',
            sidebar.hidden
              ? 'lg:ms-[calc(var(--sidebar-rail-width)+0.75rem)]'
              : 'lg:ms-[calc(var(--sidebar-width)+0.75rem)]',
          )}
        >
          <div className="flex min-h-0 min-w-0 grow flex-col overflow-x-hidden overflow-y-auto overscroll-contain pt-4 [scrollbar-gutter:stable]">
            <main
              className="min-h-full w-full min-w-0 max-w-none grow"
              role="content"
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo8Layout;

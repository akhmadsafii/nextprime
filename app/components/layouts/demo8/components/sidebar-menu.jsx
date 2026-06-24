'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  Building2,
  Factory,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarMenu() {
  const pathname = usePathname();
  const companyId = pathname.startsWith('/floor') ? 'floor' : 'panel';
  const itemClassName = cn(
    'relative flex h-[64px] w-[72px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-transparent px-1.5 py-2',
    'bg-transparent text-center text-[11px] font-medium leading-tight whitespace-nowrap text-muted-foreground transition-all duration-200',
    'hover:border-border/70 hover:bg-background/70 hover:text-foreground',
    'aria-[current=page]:border-border aria-[current=page]:bg-background aria-[current=page]:text-primary aria-[current=page]:shadow-sm',
    'aria-[current=page]:after:absolute aria-[current=page]:after:inset-y-3 aria-[current=page]:after:start-[-9px] aria-[current=page]:after:w-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary',
  );
  const items = [
    { label: 'Overview', section: '', icon: Building2 },
    { label: 'Sales', section: 'sales', icon: ShoppingCart },
    { label: 'Production', section: 'production', icon: Factory },
    { label: 'Raw Mat.', section: 'raw-material', icon: Boxes },
    { label: 'Cost', section: 'cost', icon: WalletCards },
    { label: 'People', section: 'people', icon: Users },
  ];

  return (
    <nav
      className="kt-scrollable-y-auto flex h-full flex-col items-center gap-2 overflow-x-hidden px-2 py-1"
      aria-label="Navigasi utama"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const href = `/${companyId}${item.section ? `/${item.section}` : ''}`;
        return (
          <Link
            key={item.section}
            aria-label={item.label}
            aria-current={pathname === href ? 'page' : undefined}
            href={href}
            className={itemClassName}
          >
            <Icon className="size-[21px]! shrink-0" strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

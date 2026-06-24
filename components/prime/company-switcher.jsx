'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Factory } from 'lucide-react';
import { businessUnits } from '@/lib/executive-dashboard';
import { cn } from '@/lib/utils';

export function CompanySwitcher({ compact = false }) {
  const pathname = usePathname();
  const activeCompany = pathname.startsWith('/floor') ? 'floor' : 'panel';
  const section = pathname.split('/').filter(Boolean)[1] || '';

  return (
    <div
      className={cn(
        'flex',
        compact
          ? 'w-[72px] flex-col gap-1.5 rounded-2xl border border-border bg-background/55 p-1.5 shadow-sm'
          : 'gap-1 rounded-2xl border border-border bg-muted/70 p-1',
      )}
      aria-label="Pilih perusahaan"
    >
      {businessUnits.map((unit) => {
        const href = section ? `/${unit.id}/${section}` : `/${unit.id}`;
        const active = activeCompany === unit.id;
        const Icon = unit.id === 'panel' ? Building2 : Factory;

        return (
          <Link
            key={unit.id}
            href={href}
            className={cn(
              'flex items-center justify-center rounded-xl font-semibold transition',
              compact
                ? 'relative h-[54px] w-full flex-col gap-1 text-[10px] leading-none'
                : 'min-w-28 gap-2 px-4 py-2.5 text-sm',
              active
                ? compact
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background text-primary shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {compact ? (
              <Icon className="size-4" />
            ) : (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: unit.accent }}
              />
            )}
            {unit.name}
            {compact && active && (
              <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-white/90" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

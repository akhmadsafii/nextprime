'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Boxes,
  Building2,
  Factory,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react';
import { businessUnits, executiveMetrics } from '@/lib/executive-dashboard';
import { CompanySwitcher } from '@/components/prime/company-switcher';

const icons = {
  sales: ShoppingCart,
  production: Factory,
  'raw-material': Boxes,
  cost: WalletCards,
  people: Users,
};

export function ComparisonDomainDashboard({ companyId, metricId }) {
  const metric = executiveMetrics.find((item) => item.id === metricId);
  const company =
    businessUnits.find((item) => item.id === companyId) || businessUnits[0];
  const Icon = icons[metricId] || Building2;

  return (
    <main className="w-full px-4 pb-6 lg:px-5">
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl lg:p-8">
        <Link
          href={`/${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          {company.name} overview
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10">
            <Icon className="size-7" />
          </span>
          <div>
            <p className="text-sm font-medium text-blue-300">
              {company.company} · Plant {company.plant}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">{metric.label}</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
          {metric.description}
        </p>
        <div className="mt-5">
          <CompanySwitcher />
        </div>
      </header>

      <section className="mt-5">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Business unit
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{company.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Plant {company.plant}
              </p>
            </div>
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: company.accent }}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-10 text-center">
            <p className="text-3xl font-semibold text-muted-foreground/35">—</p>
            <p className="mt-3 text-sm font-medium">
              Metric integration prepared
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              Kartu ini siap menerima data {metric.label.toLowerCase()} dari API
              unit {company.name}.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Detail view structure</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Halaman ini khusus menampilkan data {metric.label.toLowerCase()} milik
          {` ${company.name}`}. Switch perusahaan di atas mempertahankan domain
          yang sedang dilihat.
        </p>
      </section>
    </main>
  );
}

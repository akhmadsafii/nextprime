'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  Building2,
  CircleAlert,
  Factory,
  LoaderCircle,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { businessUnits, executiveMetrics } from '@/lib/executive-dashboard';
import { primeApi } from '@/lib/prime-api';
import { CompanySwitcher } from '@/components/prime/company-switcher';

const format = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const icons = {
  sales: ShoppingCart,
  production: Factory,
  'raw-material': Boxes,
  cost: WalletCards,
  people: Users,
};

export function CompanyOverviewDashboard({ companyId }) {
  const company =
    businessUnits.find((unit) => unit.id === companyId) || businessUnits[0];
  const [sales, setSales] = useState(null);
  const [production, setProduction] = useState(null);
  const [loading, setLoading] = useState(companyId === 'panel');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSales(null);
    setProduction(null);
    setNotice('');

    if (companyId !== 'panel') {
      setLoading(false);
      setNotice('Data Floor menunggu endpoint NestJS Floor.');
      return;
    }

    setLoading(true);
    Promise.allSettled([
      primeApi.panel.sales(company.plant),
      primeApi.panel.production(company.plant),
    ])
      .then(([salesResult, productionResult]) => {
        if (salesResult.status === 'fulfilled') {
          setSales(salesResult.value.data);
        }
        if (productionResult.status === 'fulfilled') {
          setProduction(productionResult.value.data);
        }
        if (
          salesResult.status === 'rejected' ||
          productionResult.status === 'rejected'
        ) {
          setNotice('Sebagian sumber data Panel belum tersedia.');
        }
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  const cards = [
    {
      id: 'sales',
      value: sales?.summary.sales_performance.actual_sales_qty,
      suffix: 'M³',
      note: sales
        ? `${sales.summary.sales_performance.achievement_percentage}% target`
        : 'Sales performance',
    },
    {
      id: 'production',
      value: production?.outputProduction.actual,
      suffix: production?.outputProduction.unit,
      note: production
        ? `${production.outputProduction.percentage}% plan`
        : 'Production output',
    },
    {
      id: 'raw-material',
      value: null,
      note: 'Inventory & coverage',
    },
    { id: 'cost', value: null, note: 'Total & unit cost' },
    { id: 'people', value: null, note: 'Headcount & attendance' },
  ];

  const chartData = [
    {
      name: 'Sales',
      Actual: sales?.summary.sales_performance.actual_sales_qty || 0,
      Plan: sales?.summary.sales_performance.annual_sales_target || 0,
    },
    {
      name: 'Production',
      Actual: production?.outputProduction.actual || 0,
      Plan: production?.outputProduction.plan || 0,
    },
  ];

  return (
    <main className="flex min-h-full w-full flex-col px-4 pb-6 lg:px-5">
      <header className="shrink-0 rounded-3xl bg-slate-950 px-6 py-4 text-white shadow-xl lg:px-7">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Executive dashboard · Plant {company.plant}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {company.company}
              </h1>
            </div>
          </div>
          <CompanySwitcher />
        </div>
      </header>

      {notice && (
        <div className="mt-3 flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
          <CircleAlert className="size-4" />
          {notice}
        </div>
      )}

      <section className="mt-3 grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((card) => {
          const metric = executiveMetrics.find((item) => item.id === card.id);
          const Icon = icons[card.id];
          return (
            <Link
              key={card.id}
              href={`/${companyId}/${card.id}`}
              className="group rounded-2xl border border-border bg-card p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>
              {loading && ['sales', 'production'].includes(card.id) ? (
                <LoaderCircle className="mt-2 size-5 animate-spin text-primary" />
              ) : (
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {card.value == null ? '—' : format.format(card.value)}
                  {card.value != null && card.suffix && (
                    <span className="ml-1 text-xs font-medium text-muted-foreground">
                      {card.suffix}
                    </span>
                  )}
                </p>
              )}
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {card.note}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-3 grid min-h-[360px] grow gap-3 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="flex min-h-[300px] flex-col rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Actual vs plan
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Current Company Performance
            </h2>
          </div>
          <div className="mt-3 min-h-0 grow">
            <ResponsiveContainer>
              <BarChart data={chartData} barGap={10}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="Actual"
                  fill={company.accent}
                  radius={[7, 7, 0, 0]}
                />
                <Bar dataKey="Plan" fill="#94a3b8" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Director attention
          </p>
          <h2 className="mt-1 text-lg font-semibold">What needs attention</h2>
          <div className="mt-4 space-y-3">
            {cards.slice(0, 4).map((card) => {
              const metric = executiveMetrics.find(
                (item) => item.id === card.id,
              );
              return (
                <Link
                  key={card.id}
                  href={`/${companyId}/${card.id}`}
                  className="flex items-center justify-between rounded-2xl bg-muted/55 px-4 py-3 transition hover:bg-primary/5"
                >
                  <div>
                    <p className="text-sm font-semibold">{metric.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {card.value == null ? 'Waiting for live data' : card.note}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CircleAlert, LoaderCircle, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { primeApi } from '@/lib/prime-api';

const format = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm xl:p-3">
      <div className="mb-3 xl:mb-2">
        <h2 className="font-semibold text-foreground xl:text-sm">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground xl:text-[11px]">
            {subtitle}
          </p>
        )}
      </div>
      <div className="h-64 xl:h-[210px] 2xl:h-[230px]">{children}</div>
    </section>
  );
}

function Metric({ label, value, note, positive = true }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:p-3.5">
      <p className="text-sm text-muted-foreground xl:text-xs">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground xl:mt-1.5 xl:text-xl">
        {format.format(value || 0)}
      </p>
      <p
        className={`mt-2 text-sm font-medium xl:mt-1 xl:text-[11px] ${positive ? 'text-emerald-600' : 'text-amber-600'}`}
      >
        {note}
      </p>
    </article>
  );
}

export function PanelSalesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    primeApi.panel
      .sales()
      .then((result) => setData(result.data))
      .catch((cause) => setError(cause.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex min-h-80 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Memuat data Prime…
      </div>
    );
  if (error)
    return (
      <div className="m-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <CircleAlert className="size-5" />
        {error}
      </div>
    );

  const { summary, charts } = data;
  const salesProduct = charts.sales_product.categories.map((name, index) => ({
    name,
    actual: charts.sales_product.actual[index],
    plan: charts.sales_product.plan[index],
  }));
  const orders = charts.sales_order_monthly.categories.map((month, index) => ({
    month,
    orders: charts.sales_order_monthly.sales_order[index],
  }));
  const region = charts.region_sales.categories.map((name, index) => ({
    name,
    value: charts.region_sales.data[index],
  }));
  const production = charts.prod_vs_sales.categories.map((month, index) => ({
    month,
    production: charts.prod_vs_sales.production[index],
    sales: charts.prod_vs_sales.sales[index],
  }));
  const price = charts.avg_price_trend.categories.map((year, index) => ({
    year,
    actual: charts.avg_price_trend.price[index],
    plan: charts.avg_price_trend.plan[index],
  }));

  return (
    <main className="w-full min-w-0 px-4 pb-6 lg:px-5 xl:pb-4">
      <header className="mb-3 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-primary px-5 py-4 text-white shadow-lg xl:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
              Prime · Panel
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight xl:text-xl">
              Sales Performance
            </h1>
            <p className="mt-1 text-xs text-white/70">
              Plant {summary.period.plant} · {summary.period.start_date} —{' '}
              {summary.period.end_date}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-right backdrop-blur xl:py-1.5">
            <p className="text-xs text-white/70">Achievement</p>
            <p className="mt-1 text-xl font-semibold xl:text-lg">
              {format.format(summary.sales_performance.achievement_percentage)}%
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Actual Sales"
          value={summary.sales_performance.actual_sales_qty}
          note={`${format.format(summary.sales_performance.achievement_percentage)}% of target`}
          positive={summary.sales_performance.status === 'target_achieved'}
        />
        <Metric
          label="Sales Target"
          value={summary.sales_performance.annual_sales_target}
          note="Monthly plan"
        />
        <Metric
          label="Actual ASP"
          value={summary.pricing_performance.actual_selling_price}
          note={`${format.format(summary.pricing_performance.variance)} vs target`}
          positive={summary.pricing_performance.variance >= 0}
        />
        <Metric
          label="Order Quantity"
          value={summary.additional_metrics.total_order_quantity}
          note="Projected this month"
        />
      </section>

      <section className="mt-3 grid min-w-0 gap-3 xl:grid-cols-4">
        <ChartCard title="Sales by Product" subtitle="Actual vs plan (M3)">
          <ResponsiveContainer>
            <BarChart data={salesProduct}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="actual"
                name="Actual"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="plan"
                name="Plan"
                fill="#94a3b8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Production vs Sales" subtitle="Rolling twelve months">
          <ResponsiveContainer>
            <LineChart data={production}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#0f766e"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f97316"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Sales Orders" subtitle="Monthly order quantity">
          <ResponsiveContainer>
            <BarChart data={orders}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
              <Tooltip />
              <Bar
                dataKey="orders"
                name="Orders"
                fill="#7c3aed"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Average Selling Price"
          subtitle="Historical actual vs plan"
        >
          <ResponsiveContainer>
            <LineChart data={price}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#2563eb"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="plan"
                name="Plan"
                stroke="#94a3b8"
                strokeWidth={3}
                strokeDasharray="6 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-sm xl:flex xl:items-center xl:gap-4 xl:p-3">
        <div className="mb-4 flex items-center gap-2 xl:mb-0 xl:shrink-0">
          <BarChart3 className="size-5 text-primary xl:size-4" />
          <h2 className="font-semibold xl:text-sm">Sales by Region</h2>
          <TrendingUp className="ml-auto size-5 text-emerald-600" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grow xl:gap-2">
          {region.map((item) => (
            <div
              key={item.name}
              className="rounded-xl bg-muted/60 p-4 xl:flex xl:items-center xl:justify-between xl:px-3 xl:py-2"
            >
              <p className="text-sm text-muted-foreground xl:text-xs">
                {item.name}
              </p>
              <p className="mt-1 text-xl font-semibold xl:mt-0 xl:text-base">
                {format.format(item.value)} M3
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

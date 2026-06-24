'use client';

import { useEffect, useState } from 'react';
import { CircleAlert, Factory, LoaderCircle } from 'lucide-react';
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

const format = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

function Card({ title, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-3 font-semibold text-foreground">{title}</h2>
      <div className="h-64 2xl:h-[320px]">{children}</div>
    </section>
  );
}

function Metric({ label, value, unit, note }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {format.format(value)}{' '}
        <span className="text-base font-medium text-muted-foreground">
          {unit}
        </span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </article>
  );
}

export function PanelProductionDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    primeApi.panel
      .production()
      .then((result) => setData(result.data))
      .catch((cause) => setError(cause.message));
  }, []);

  if (error)
    return (
      <div className="m-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <CircleAlert className="size-5" />
        {error}
      </div>
    );
  if (!data)
    return (
      <div className="flex min-h-80 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Memuat data Prime…
      </div>
    );

  const output = data.outputProduction;
  const outputByProduct = data.outputProductionChart.categories.map(
    (name, index) => ({
      name,
      actual: data.outputProductionChart.actual[index],
      plan: data.outputProductionChart.plan[index],
    }),
  );
  const productionTrend = data.productionTrend.categories.map(
    (month, index) => ({
      month,
      actual: data.productionTrend.actual[index],
      plan: data.productionTrend.plan[index],
    }),
  );
  const inventoryTrend = data.stockTrend.categories.map((month, index) => ({
    month,
    stock: data.stockTrend.data[index],
  }));

  return (
    <main className="w-full min-w-0 px-4 pb-4 lg:px-5">
      <header className="mb-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-teal-700 p-5 text-white shadow-lg">
        <p className="text-sm font-medium text-white/70">Prime · Panel</p>
        <div className="mt-2 flex items-center gap-3">
          <Factory className="size-7" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Production Performance
          </h1>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Actual Output"
          value={output.actual}
          unit={output.unit}
          note={`${output.percentage}% of plan`}
        />
        <Metric
          label="Production Plan"
          value={output.plan}
          unit={output.unit}
          note="Current period"
        />
        <Metric
          label="MTD Inventory"
          value={data.cumulativeInventory.mtd}
          unit={data.cumulativeInventory.unit}
          note="Month to date"
        />
        <Metric
          label="YTD Inventory"
          value={data.cumulativeInventory.ytd}
          unit={data.cumulativeInventory.unit}
          note="Year to date"
        />
      </section>

      <section className="mt-3 grid min-w-0 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
        <Card title="Output by Product">
          <ResponsiveContainer>
            <BarChart data={outputByProduct}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="actual"
                name="Actual"
                fill="#0f766e"
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
        </Card>
        <Card title="Production Trend">
          <ResponsiveContainer>
            <LineChart data={productionTrend}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#0f766e"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="plan"
                name="Plan"
                stroke="#94a3b8"
                strokeWidth={3}
                strokeDasharray="6 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Stock Trend">
          <ResponsiveContainer>
            <LineChart data={inventoryTrend}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="stock"
                name="Stock"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </main>
  );
}
